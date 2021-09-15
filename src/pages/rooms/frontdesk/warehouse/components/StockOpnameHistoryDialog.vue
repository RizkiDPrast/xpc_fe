<template>
  <q-dialog v-model="model" full-width full-height>
    <q-card>
      <dialog-header>
        Stock opname history @{{ $util.toDateString(stockOpname.createdAt) }}
      </dialog-header>
      <q-card-section>
        <my-table
          title=""
          :loading="loading"
          :data="data"
          :columns="columns"
          row-key="id"
          :pagination.sync="pager"
          :filter="filter"
          @request="fetch"
          addBtnIcon="las la-save"
          addBtnClass="text-secondary"
        >
          <template #title> </template>
          <template #actions>
            <q-select
              :options="['All', 'Pet shop products', 'Medical products']"
              :disable="loading"
              v-model="petShopOnly"
              label="Filter"
              dense
              outlined
              debounce="500"
              style="min-width:100px"
            />
          </template>

          <template #body-cell-action="props">
            <q-td>
              <q-btn icon="las la-ellipsis-v" flat round size="sm">
                <q-menu>
                  <q-list>
                    <q-item
                      v-close-popup
                      v-if="isAdmin || isFinance"
                      clickable
                      @click="
                        $router.push(
                          `/app/rooms/products/${props.row.productId}`
                        )
                      "
                    >
                      <q-item-section>
                        Check product details
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>
        </my-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: () => false
    },
    stockOpname: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      data: [],
      columns: [
        {
          name: "action",
          label: "",
          width: "12px",
          align: "center"
        },
        ,{
          name: "#",
          label: "#",
          width: "12px",
          align: "center",
          format: (val, row) => this.data.indexOf(row) + 1
        },
        {
          name: "purchaseref",
          label: "Purchasing ref",
          width: "25px",
          align: "center",
          field: 'purchaseRef'
        },
        {
          name: "product.categoryId",
          label: "Category",
          field: row => row.product.categoryId,
          align: "left",
          format: val => this.getCategoryName(val)
        },
        {
          name: "product.sku",
          label: "SKU",
          field: row => row.product.sku,
          align: "left"
        },
        {
          name: "product.name",
          label: "Product",
          field: row => row.product.name,
          align: "left"
        },
        {
          name: "product.qty",
          label: "Product Qty",
          field: row => row.product.qty,
          align: "center",
          classes: (row) => row.product.qty < row.product.minimumQty ?  "text-negative" : "text-bold"
        },    
        {
          name: "product.minimumQty",
          label: "Min Qty",
          field: row => row.product.minimumQty,
          align: "center",
          classes: 'text-green'
        },
        {
          name: "unitId",
          label: "Unit",
          field: "unitId",
          align: "left",
          format: val => this.getUnitName(val)
        },
        {
          name: "stockIn",
          label: "In",
          field: "stockIn",
          align: "right",
          format: val => val.toFixed(2)
        },
        {
          name: "stockout",
          label: "Out",
          field: "stockOut",
          align: "right",
          format: val => val.toFixed(2)
        },
        {
          name: "stockInOut",
          label: "Stock",
          field: "stockInOut",
          align: "right",
          classes: "text-bold",
          format: val => val.toFixed(2)
        },
        {
          name: "expDate",
          label: "Exp At",
          field: "expDate",
          align: "center",
          classes: "text-negative",
          format: val => this.$util.toDateString(val)
        },

        {
          name: "unitCost",
          label: "Purchasing price",
          field: "unitCost",
          align: "right",
          format: val => this.$options.filters.money(val)
        },    
        {
          name: "note",
          label: "Note",
          field: "note",
          align: "left",
          style: "max-width: 200px;white-space: break-spaces;"
        },
        {
          name: "createdBy",
          label: "Created by",
          field: "createdByName",
          align: "left"
        },
        {
          name: "modifiedByName",
          label: "Modified by",
          field: "modifiedByName",
          align: "left"
        }
      ],
      pager: {
        page: 1,
        rowsPerPage: 25,
        rowsNumber: 0
      },
      filter: undefined,
      petShopOnly: "All"
    };
  },
  mounted() {
    this.fetch();
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  watch: {
    petShopOnly() {
      this.fetch();
    },
    "stockOpname.id"(val) {
      if (val) {
        this.fetch();
      }
    }
  },
  methods: {
    async fetch(pager) {
      if (!this.stockOpname || !this.stockOpname.id) return;

      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      if (this.petShopOnly !== "All") {
        if (this.petShopOnly === "Pet shop products") {
          pager.petShopOnly = true;
        } else {
          pager.petShopOnly = false;
        }
      }
      pager.stockOpnameId = this.stockOpname.id;
      try {
        var res = await this.$api.stocks.getHistoryData(pager);
        var dt = res.data;
        this.data = dt.rows.map(x => x);

        // this.columns = this.columns.map(x => {
        //   return Object.assign({}, x, {
        //     sortable: dt.sortColumns.indexOf(x.field.toLowerCase()) > -1
        //   });
        // });

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
