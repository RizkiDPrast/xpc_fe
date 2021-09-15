<template>
  <div>
    <page-header>
      <template #actions> </template>
    </page-header>
    <div class="row">
      <div class="col-9 q-pa-sm">
        <my-table
          title="Stock-managed product list"
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
          addBtnIcon="las la-save"
          :addBtnClass="(isAdmin || isFinance) ? 'text-secondary' : 'hidden'"
        >
          <template #title>
            <q-toolbar-title style="flex:auto;" class="col-8">
              Stock-managed products
            </q-toolbar-title>
          </template>
          <template #actions>
            <q-checkbox v-model="expireSoon" label="Near to Expiry" style="width:200px" >
              <q-tooltip content-class="bg-secondary">
                Show available stocks that almost expire (in 7 days)
              </q-tooltip>
            </q-checkbox>
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
              <q-btn icon="las la-ellipsis-v" flat round size="sm"  v-if="isAdmin || isFinance" >
                <q-menu>
                  <q-list>
                    <q-item
                      v-close-popup
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
                    <UpdateStockDialogItem :stockJournal="props.row" />
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>
        </my-table>
      </div>

      <div class="col-3 q-pa-sm">
        <q-toolbar>
          <q-toolbar-title> Stock History </q-toolbar-title>
          <q-btn flat round dense icon="las la-sync" @click="fetch2" />
        </q-toolbar>
        <q-table
          title=""
          :loading="loading2"
          :data="data2"
          :columns="columns2"
          row-key="id"
          :pagination.sync="pager2"
          bordered
          @row-click="rowClick"
        />
      </div>
    </div>
    <StockOpnameHistoryDialog
      :stockOpname="stockOpname"
      v-model="historyDialog"
    />
  </div>
</template>

<script>
import UpdateStockDialogItem from "./components/UpdateStockDialogItem";
import StockOpnameHistoryDialog from "./components/StockOpnameHistoryDialog";
export default {
  components: {
    UpdateStockDialogItem,
    StockOpnameHistoryDialog
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
        {
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
          classes: 'text-bold',
          field: row => row.product.qty,
          align: "center",
          classes: (row) => row.product.qty < row.product.minimumQty ?  "text-negative" : "text-bold"
        }, 
        {
          name: "product.minimumQty",
          label: "Min Qty",
          field: row => row.product.minimumQty,
          align: "center",
          classes: "text-green"
        },
        {
          name: "unitId",
          label: "Unit",
          field: "unitId",
          align: "center",
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
      petShopOnly: "All",
      expireSoon: false,
      savingOpname: false,
      loading2: false,
      data2: [],
      columns2: [
        {
          name: "#",
          label: "#",
          width: "12px",
          align: "center",
          format: (val, row) => this.data2.indexOf(row) + 1
        },
        {
          name: "createdAt",
          label: "Created At",
          field: "createdAt",
          align: "center",
          format: val => this.$util.toDateString(val)
        },
        {
          name: "createdBy",
          label: "Created by",
          field: "createdByName",
          align: "left"
        }
      ],
      pager2: {
        page: 1,
        rowsPerPage: 25,
        rowsNumber: 0
      },
      historyDialog: false,
      stockOpname: {}
    };
  },
  mounted() {
    this.fetch();
    this.fetch2();
  },
  watch: {
    petShopOnly() {
      this.fetch();
    },
    expireSoon(){
      this.fetch()
    }
  },
  methods: {
    rowClick(ev, row, ix) {
      console.log(row);
      this.stockOpname = row;
      this.historyDialog = true;
    },
    async fetch2(pager) {
      if (this.loading2) return;
      this.loading2 = true;
      pager = pager?.pagination || this.pager2;

      try {
        var res = await this.$api.stocks.getHistory(pager);
        var dt = res.data;
        this.data2 = dt.rows.map(x => x);

        // this.columns = this.columns.map(x => {
        //   return Object.assign({}, x, {
        //     sortable: dt.sortColumns.indexOf(x.field.toLowerCase()) > -1
        //   });
        // });

        this.pager2.rowsNumber = dt.rowsNumber;
        this.pager2.page = dt.page;
        this.pager2.sortBy = dt.sortBy;
        this.pager2.descending = dt.descending;
        this.pager2.rowsPerPage = dt.rowsPerPage;
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading2 = false;
    },
    async fetch(pager) {
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

      if(this.expireSoon){
        pager.expireSoon = true;
      } else {
        pager.expireSoon = undefined;
      }

      try {
        var res = await this.$api.stocks.get(pager);
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
    },
    async add() {
      if (
        confirm(
          "This action will create snapshot of current stock fo reference. Please make sure stock is already valid"
        )
      ) {
        try {
          if (this.savingOpname) return;
          this.savingOpname = true;
          await this.$api.stocks.postHistory();
          this.$toastr.success("Snapshot of current stocks was saved");
          this.fetch2();
        } catch (e) {
          this.$toastr.error(e);
        }

        this.savingOpname = true;
      }
      //   this.$router.push({ path: `/app/rooms/client-pets` });
    },
    edit(id) {
      //   this.$router.push({ path: `/app/rooms/client-pets/${id}` });
    },
    async del(id) {
      //   console.log("delete", id);
      //   if (this.loading) return;
      //   this.loading = true;
      //   try {
      //     var res = await this.clients.delete(id);
      //     if (res.status < 300) {
      //       this.data = this.data.filter(val => val.id !== id);
      //       this.$toastr.success("Record was deleted");
      //     }
      //   } catch (e) {
      //     this.$toastr.error(e);
      //   }
      //   this.loading = false;
    }
  }
};
</script>
