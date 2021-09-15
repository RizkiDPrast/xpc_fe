<template>
  <div>
    <page-header>
      <template #actions>
        
      </template>
    </page-header>
    <my-table
      :title="`Unpaid receipts ${!data.length ? '' : ' - Tot: ' + $options.filters.money(data.reduce((a,b)=> a + b.unpaid, 0))}`"
      :loading="loading"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pager"
      :filter="filter"
      @request="fetch"
      addBtnClass="hidden"
      grid
      bordered
      dense
      card-class="shadow-3"
    >
    <template #body-cell-phone="props">
        <q-td>
          <template v-if="props.row.waPhone">
            <wa-btn :value="props.row.waPhone" />
            {{ props.row.waPhone }} <br />
          </template>
          <template v-if="props.row.otherPhones">
            Other phones: {{ props.row.otherPhones }}
          </template>
        </q-td>
      </template>
    </my-table>
  </div>
</template>

<script>
import Sale from "src/models/Sale";
export default {
  name:"UnpaidReceipts",
  data() {
    return {
      loading: false,
      data: [],
       columns: [
        {
          name: "client",
          label: "Client",
          field: (row)=> `${row.client?.code} - ${row.client?.name}`,
          align: "left"
        },
        {
          name: "SaleDate",
          label: "Trx date",
          field: "saleDate",
          align: "left",
          format: val => this.$util.toDateString(val)
        },
        {
          name: "receiptcode",
          label: "Receipt Code",
          field: "receiptCode",
          align: "left",
          classes: 'text-bold'
        },
        {
          name: "total",
          label: "Net Sales",
          field: "total",
          align: "right",
          format: (val)=> this.$options.filters.money(val)
        },
        {
          name: "totalPayment",
          label: "Payment",
          field: "totalPayment",
          align: "right",
          format: (val)=> this.$options.filters.money(val)
        },
        {
          name: "unpaid",
          label: "Total Unpaid",
          field: "unpaid",
          align: "right",
          format: (val)=> this.$options.filters.money(val)
        },
        {
          name: "note",
          label: "Note",
          field: "note",
          align: "left"
        },       
      ],
      pager: {
        page: 1,
        rowsPerPage: 25,
        rowsNumber: 0
      },
      filter: undefined,
    };
  },
  mounted() {
    this.fetch();
  },
  watch: {
   
  },
  methods: {
    async fetch() {
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.sales.getUnpaid();
        var dt = res.data;
        this.data = dt.map(x => new Sale(x));

      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    }
  
  }
};
</script>
