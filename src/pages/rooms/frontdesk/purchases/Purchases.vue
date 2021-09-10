<template>
  <q-page padding>
    <page-header>
      <template #actions>
        <q-btn
          flat
          round
          icon="las la-truck-moving"
          color="accent"
          @click="showSuppliers = true"
        >
          <q-tooltip content-class="bg-accent">
            Supplier list
          </q-tooltip>
        </q-btn>
      </template>
    </page-header>
    <supplier-dialog v-model="showSuppliers" />
    <my-table
      title="Purchases"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pager"
      :loading="loading"
      :filter="filter"
      @request="fetch"
      @add="add"
      @edit="edit"
      @delete="del"
    >
      <template #body-cell-actions2="props">
        <q-td class="text-center">
          <q-btn
            flat
            size="sm"
            label="Details"
            type="a"
            @click.prevent="
              $router.push(`/app/rooms/purchases/${props.row.id}`)
            "
          />
        </q-td>
      </template>
    </my-table>
  </q-page>
</template>

<script>
import Purchase from "src/models/Purchase";
import Supplier from "src/models/Supplier";
import SupplierDialog from "./components/SupplierDialog";

export default {
  name: "categories",
  components: {
    SupplierDialog
  },
  data() {
    return {
      loading: false,
      filter: "",
      showSuppliers: false,
      pager: {
        page: 1,
        rowsPerPage: 25,
        rowsNumber: 0,
        sortBy: "purchaseDate",
        descending: true
      },
      columns: [
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
          name: "purchaseDate",
          align: "left",
          field: "purchaseDate",
          label: "Purchase date",
          sortable: true,
          format: val => this.$util.formatDate(val, "dddd, DD MMM YYYY")
        },
        {
          name: "invoiceNumber",
          align: "left",
          field: "invoiceNumber",
          label: "Invoice Num",
          sortable: true
        },
        {
          name: "supplierName",
          align: "left",
          field: "supplierName",
          label: "Supplier",
          sortable: true
        },
        {
          name: "totalQty",
          align: "center",
          field: "totalQty",
          label: "item qty",
          sortable: true
        },
        {
          name: "realCost",
          align: "right",
          field: "realCost",
          label: "Total Purchase",
          sortable: true,
          format: val => this.$options.filters.money(val)
        },
        {
          name: "actions2",
          align: "center",
          field: "actions",
          label: "Actions",
          style: "width:25px"
        }
      ],
      data: []
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch(pager) {
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      try {
        var res = await this.$api.purchases.get(pager);
        var dt = res.data;
        this.data = dt.rows.map(x => new Purchase(x));

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
      this.$router.push({ path: `/app/rooms/purchases/0` });
    },
    edit(id) {
      this.$router.push({ path: `/app/rooms/purchases/${id}` });
    },
    async del(id) {
      if (this.loading) return;
      this.loading = true;

      try {
        var res = await this.purchases.delete(id);
        if (res.status < 300) {
          this.data = this.data.filter(val => val.id !== id);
          this.$toastr.success("Record was deleted");
        }
      } catch (e) {
        this.$toastr.error(e);
      }

      this.loading = false;
    }
  }
};
</script>

<style></style>
