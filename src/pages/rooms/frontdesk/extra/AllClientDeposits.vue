<template>
  <div>
    <page-header>
      <template #actions> </template>
    </page-header>
    <my-table
      :title="`All client deposits ${$options.filters.money(total)}`"
      :loading="loading"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pager"
      :filter="filter"
      @refresh="fetch"
      @add="add"
    >
      <template #actions>
        <deposit-list-dialog-btn
          label="Semua transaksi"
          icon="las la-dialog"
          no-caps
          flat
          color="secondary"
        />
      </template>
    </my-table>
  </div>
</template>

<script>
import DepositListDialogBtn from "./DepositListDialogBtn.vue";
export default {
  name: "AllClientDeposits",
  components: {
    DepositListDialogBtn
  },
  data() {
    return {
      loading: false,
      data: [],
      columns: [
        {
          name: "id",
          label: "#",
          format: (val, row) => this.data.indexOf(row) + 1,
          align: "left"
        },
        {
          name: "customerData",
          label: "Client",
          field: "customerData",
          align: "left"
        },
        {
          name: "balance",
          label: "Balance",
          field: "balance",
          align: "right",
          format: val => this.$options.filters.money(val)
        },
        {
          name: "lastNote",
          label: "Last Note",
          field: "lastNote",
          align: "left"
        }
      ],
      pager: {
        page: 1,
        rowsPerPage: 25
        // rowsNumber: 0
      },
      filter: undefined,
      total: null
    };
  },
  mounted() {
    this.fetch();
  },
  watch: {},
  methods: {
    add() {
      this.$router.push("/app/rooms/sales");
    },
    async fetch() {
      if (this.loading) return;
      this.loading = true;

      try {
        var res = await this.$api.deposits.getAllClients();
        var dt = res.data.sort((a, b) => (a.code > b.code ? -1 : 1));
        this.data = dt.map(x => x);

        this.total = dt.reduce((a, b) => a + Number(b.balance) || 0, 0);
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    }
  }
};
</script>
