<template>
  <div v-if="isAdmin || isFinance">
    <page-header>
      <template #actions>
        <!-- <q-btn flat round dense icon="las la-ellipsis-v" /> -->
        <q-btn
          flat
          round
          dense
          icon="las la-tag"
          @click="showCategories = true"
        >
          <q-tooltip content-class="bg-secondary">
            Manage categories
          </q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="las la-pills" @click="showUnits = true">
          <q-tooltip content-class="bg-secondary">
            Manage units
          </q-tooltip>
        </q-btn>
      </template>
    </page-header>
    <my-table
      :loading="loading"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pager"
      :filter="filter"
      @request="fetch"
      @delete="del"
      @add="add"
      @edit="edit"
    >
      <template #actions>
        <q-btn
          no-caps
          rounded
          @click="outOfStock = !outOfStock"
          :flat="!outOfStock"
          :text-color="outOfStock ? 'primary' : 'grey'"
          :label="
            outOfStock
              ? 'Out-of-stock products'
              : 'Filter out-of-stock products'
          "
        >
          <q-tooltip content-class="bg-secondary">
            Filter only stock-managed inventory products having quantity &lt;
            minimum quantity
          </q-tooltip>
        </q-btn>
        <q-radio
          size="sm"
          v-model="discontinued"
          :val="false"
          label="Active products"
        />
        <q-radio
          size="sm"
          v-model="discontinued"
          :val="true"
          label="Discontinued products"
        />
      </template>
      <template #body-cell-qty="props">
        <q-td class="text-center">
          <template v-if="props.row.trackInventory">
            <div
              :class="
                props.row.qty <= props.row.minimumQty
                  ? 'text-negative'
                  : 'text-bold'
              "
            >
              {{ props.row.qty }}
            </div>
            <!-- <q-btn
              no-caps
              flat
              size="sm"
              label="Deactivate Tracking"
              color="secondary"
              :loading="submitting"
              @click="updateStatus(props.row.id, false)"
            /> -->
          </template>
          <template v-else>
            <q-btn
              flat
              size="sm"
              label="Activate inventory tracking"
              no-caps
              color="primary"
            >
              <q-popup-edit v-model="newStock">
                <q-form
                  @submit="updateStatus(props.row.id)"
                  :loading="submitting"
                >
                  <q-card class="no-shadow">
                    <q-card-section>
                      <q-toggle :value="true" label="Track inventory" />
                      <q-input
                        label="Initial Stock"
                        v-model="newStock"
                        min="0"
                        required
                      >
                        <template #append>
                          {{ getUnitName(props.row.unitId) }}
                        </template>
                      </q-input>
                    </q-card-section>
                    <q-card-actions align="right">
                      <q-btn label="Cancel" v-close-popup no-caps flat />
                      <q-btn
                        label="Submit"
                        type="submit"
                        color="primary"
                        :loading="submitting"
                      />
                    </q-card-actions>
                  </q-card>
                </q-form>
              </q-popup-edit>
            </q-btn>
          </template>
        </q-td>
      </template>
    </my-table>

    <categories-dialog v-model="showCategories" />
    <units-dialog v-model="showUnits" />
  </div>
</template>

<script>
import Product from "src/models/Product";
export default {
  data() {
    return {
      loading: false,
      submitting: false,
      discontinued: false,
      outOfStock: false,
      newStock: 0,
      showCategories: false,
      showUnits: false,
      data: [],
      columns: [
        {
          name: "action",
          field: "action",
          label: "Actions"
        },
        {
          name: "id",
          field: "id",
          required: true,
          format: (val, row, c) => this.data.indexOf(row) + 1,
          style: "width: 25px",
          label: "#",
          sortable: true
        },
        {
          name: "sku",
          align: "left",
          field: "sku",
          label: "SKU",
          style: "width:10%;font-weight:bold",
          sortable: true
        },
        {
          name: "name",
          align: "left",
          field: "name",
          label: "Name",
          style: "width:25%",
          sortable: true
        },
        {
          name: "qty",
          align: "center",
          field: "qty",
          label: "Qty",
          format: (val, row, c) => (row.trackInventory ? val : ""),
          style: "",
          classes: row =>
            row.qty <= row.minimumQty ? "text-negative" : "text-bold"
        },
        {
          name: "minimumqty",
          align: "center",
          field: "minimumQty",
          label: "Minimum Qty",
          format: (val, row, c) => (row.trackInventory ? val : ""),
          style: "",
          sortable: false
        },
        {
          name: "unitId",
          align: "left",
          field: "unitId",
          format: (val, row, c) => this.getUnitName(val),
          label: "Unit",
          style: "width:25%",
          sortable: true
        },
        {
          name: "sellingPrice",
          align: "right",
          field: "sellingPrice",
          label: "Selling Price",
          format: (val, row, c) => Number(val).toLocaleString("id-ID"),
          style: "width:25%;font-weight:bold;",
          sortable: true
        },
        {
          name: "purchasingPrice",
          align: "right",
          field: "purchasingPrice",
          label: "Purchasing Price",
          format: (val, row, c) => Number(val).toLocaleString("id-ID"),
          style: "width:25%;",
          sortable: true
        },
        {
          name: "categoryId",
          align: "left",
          field: "categoryId",
          format: (val, row, c) => this.getCategoryName(val),
          label: "Category",
          style: "width:25%",
          sortable: true
        },
        {
          name: "modifiedat",
          label: "Last Modified At",
          field: "modifiedAt",
          align: "left",
          format: val => this.$util.toDateString(val)
        }
      ],
      pager: {
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0
      },
      filter: undefined
    };
  },
  watch: {
    discontinued() {
      this.fetch();
    },
    outOfStock() {
      this.fetch();
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch(pager) {
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      try {
        if (this.outOfStock) {
          pager.outOfStock = true;
        } else {
          pager.outOfStock = undefined;
        }

        var res = await this.$api.products.get(this.discontinued, pager);
        var dt = res.data;
        this.data = dt.rows.map(x => new Product(x));

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
    },
    add() {
      //console.log("add");
      this.$router.push({ path: `/app/rooms/products/0` });
    },
    edit(id) {
      this.$router.push({ path: `/app/rooms/products/${id}` });
    },
    async del(id) {
      console.log("delete", id);
      if (this.loading) return;
      this.loading = true;

      try {
        var res = await this.$api.products.delete(id);
        if (res.status < 300) {
          this.data = this.data.filter(val => val.id !== id);
          this.$toastr.success("Record was deleted");
        }
      } catch (e) {
        this.$toastr.error(e);
      }

      this.loading = false;
    },
    async updateStatus(pId, active = true) {
      if (this.submitting) return;
      this.submitting = true;
      try {
        await this.$api.products.updateInvStatus({
          id: pId,
          qty: Number(
            this.newStock && this.newStock !== null ? this.newStock : 0
          ),
          active
        });
        this.data = this.data.map(x => {
          if (x.id === pId) {
            x.qty = this.newStock;
            x.trackInventory = active;
          }
          return x;
        });

        this.newStock = undefined;
      } catch (e) {
        this.$toastr.error(e);
      }
      this.submitting = false;
    }
  }
};
</script>
