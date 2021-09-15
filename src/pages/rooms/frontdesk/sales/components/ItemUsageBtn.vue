<template>
  <span>
    <q-btn
      v-if="data.length"
      class="full-width"
      v-bind="$attrs"
      @click="model = true"
      color="negative"
      icon="las la-exclamation"
      :label="
        `${data.length} Item${
          data.length > 1 ? 's have ' : ' has '
        } not been transferred to receipt`
      "
    >
      <slot></slot>
    </q-btn>
    <q-dialog v-model="model" persistent full-width full-height maximized>
      <q-card>
        <q-toolbar class="bg-secondary text-white">
          <q-toolbar-title>
            Manage Item Usage
          </q-toolbar-title>
          <q-btn
            flat
            round
            text-color="white"
            icon="las la-times"
            v-close-popup
          />
        </q-toolbar>
        <q-card-section class="row">
          <div class="col-6 q-pa-sm">
            <my-table
              title="Untransferred Item Usage"
              :loading="loading"
              :data="data"
              :columns="columns"
              row-key="id"
              :pagination.sync="pager"
              :filter="filter"
              @request="fetch"
              bordered
              selection="multiple"
              :selected.sync="selected"
              addBtnClass="hidden"
            >
            </my-table>
          </div>
          <div class="col-6 q-pa-sm">
            <q-card class="my-card">
              <q-toolbar>
                <q-toolbar-title>
                  Prepare for receipt
                </q-toolbar-title>
              </q-toolbar>
              <q-card-section>
                <q-banner class="bg-grey-3">
                  <q-item v-if="selected.length">
                    <q-item-section>
                      <q-item-label>
                        Group item based on category
                      </q-item-label>
                      <q-item-label caption v-if="groupSelected">
                        Empty category won't be affected
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox v-model="groupSelected" />
                    </q-item-section>
                  </q-item>
                  <q-item v-else>
                    <q-item-section caption>
                      Please select product(s) on the left
                    </q-item-section>
                  </q-item>
                </q-banner>
              </q-card-section>
              <q-card-section>
                <q-list>
                  <q-item v-for="(item, i) in selectedModel" :key="i">
                    <q-item-section>
                      <q-item-label>
                        {{ item.itemName }}
                      </q-item-label>
                      <q-item-label caption>
                        {{ item.qty }} {{ getUnitName(item.unitId) }} x
                        {{ item.unitPrice | money }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      {{ item.lineTotal | money }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
              <q-card-section v-if="selectedModel.length">
                <q-banner class="bg-grey-3">
                  <div class="float-left q-pt-sm text-bold">
                    {{ total | money }}
                  </div>
                  <q-btn
                    label="Add to receipt"
                    flat
                    class="float-right"
                    no-caps
                    text-color="primary"
                    @click="addToReceipt"
                  />
                </q-banner>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="loading" persistent>
      <q-card style="width:500px">
        <q-banner
          style="line-height:2"
          class="bg-secondary text-white text-center"
        >
          <q-spinner-oval color="white" size="lg" /><br />
          Please wait<br />
          System fetching un-transferred item usage for this client.
        </q-banner>
      </q-card>
    </q-dialog>
  </span>
</template>

<script>
import ItemUsage from "src/models/ItemUsage";
export default {
  inheritAttrs: false,
  props: {
    clientId: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      loading: false,
      model: false,
      data: [],
      modelInput: new ItemUsage(),
      columns: [
        {
          name: "createdat",
          label: "Created at",
          field: "createdAt",
          align: "left",
          sortable: true,
          format: val => this.$util.toDateString(val)
        },
        {
          name: "itemname",
          label: "Item name",
          field: "itemName",
          align: "left",
          sortable: true
        },
        {
          name: "qty",
          label: "Qty",
          field: "qty",
          align: "right",
          sortable: true
        },
        {
          name: "unitId",
          label: "Unit",
          field: "unitId",
          format: val => this.getUnitName(val),
          sortable: true
        },
        {
          name: "unitPrice",
          label: "Unit price",
          field: "unitPrice",
          align: "right",
          format: val => this.$options.filters.money(val)
        },
        {
          name: "linetotal",
          label: "Total",
          field: "lineTotal",
          align: "right",
          format: val => this.$options.filters.money(val)
        },
        {
          name: "category",
          label: "Category",
          field: "category",
          align: "left",
          sortable: true
        }
        // {
        //   name: "transferredToReceipt",
        //   label: "Transferred",
        //   field: "transferredToReceipt",
        //   align: "left",
        //   sortable: true
        // }
      ],
      pager: {
        page: 1,
        rowsPerPage: 25,
        sortBy: "createdat",
        descending: true
      },
      filter: undefined,
      transferred: "All",
      selected: [],
      groupSelected: false
    };
  },
  computed: {
    total() {
      if (!this.selected.length) return 0;
      return this.selected.reduce((a, b) => a + b.lineTotal, 0);
    },
    selectedModel() {
      if (!this.selected.length) return [];
      // set productId to 0 to prevent multiple stock take
      if (!this.groupSelected) {
        return this.selected.map(
          x =>
            new ItemUsage({
              ...x,
              id: 0,
              productId: 0,
              product: undefined,
              itemUsageIds: [x.id]
            })
        );
      }
      return this.selected
        .map(
          x =>
            new ItemUsage({
              ...x,
              id: 0,
              productId: 0,
              product: undefined,
              itemUsageIds: [x.id]
            })
        )
        .reduce((a, b) => {
          if (!b.category || b.category === null) {
            a.push(b);
          } else {
            let cat = b.category.trim().toLowerCase();
            cat = cat.replace(cat[0], cat[0].toUpperCase());
            b.category = cat;
            let obj = a.find(x => x.category && x.category === cat);
            if (!obj) {
              b.itemName = b.category;
              b.unitPrice = b.lineTotal;
              b.qty = 1;
              b.unitId = 1;
              a.push(b);
            } else {
              obj.unitPrice += b.lineTotal;
              obj.itemUsageIds.push(b.itemUsageIds[0]);
            }
          }
          return a;
        }, []);
    }
  },
  mounted() {
    this.fetch();
  },
  watch: {
    clientId(val) {
      this.fetch();
    },
    loading(val) {
      if (!val && this.data.length) {
        this.model = true;
      }
    }
  },
  methods: {
    addToReceipt() {
      if (!this.selectedModel.length) return;
      this.$emit("item-usages-added", this.selectedModel);
      this.model = false;
    },
    async fetch(pager) {
      if (!this.clientId) {
        this.data = [];
        this.selected = [];
        return;
      }

      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      // if (this.transferred !== "All") {
      //   if (this.transferred === "Transferred only") {
      //     pager.transferred = true;
      //   } else {
      //     pager.transferred = false;
      //   }
      // }
      pager.transferred = false;

      try {
        let res = await this.$api.itemUsages.getByClient(this.clientId, pager);

        let dt = res.data;

        this.data = dt.rows.map(x => new ItemUsage(x));

        this.columns = this.columns.map(x => {
          return Object.assign({}, x, {
            sortable: dt.sortColumns.indexOf(x.field.toLowerCase()) > -1
          });
        });

        this.pager.rowsNumber = dt.rowsNumber;
        this.pager.page = dt.page;
        this.pager.sortBy = dt.sortBy;
        this.pager.descending = dt.descending;
        this.pager.rowsPerPage = dt.rowsPerPage;
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    }
  }
};
</script>
