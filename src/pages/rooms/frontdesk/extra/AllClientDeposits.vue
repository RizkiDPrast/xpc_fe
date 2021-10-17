<template>
  <div>
    <page-header>
      <template #actions> </template>
    </page-header>
    <my-table
      :title="`All client deposits`"
      :loading="loading"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pager"
      :filter="filter"
      @refresh="fetch"
      addBtnClass="hidden"
    >
    </my-table>
  </div>
</template>

<script>
export default {
  name: "AllClientDeposits",
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
      filter: undefined
    };
  },
  mounted() {
    this.fetch();
  },
  watch: {},
  methods: {
    async fetch() {
      if (this.loading) return;
      this.loading = true;

      try {
        var res = await this.$api.deposits.getAllClients();
        var dt = res.data.sort((a, b) => (a.code > b.code ? -1 : 1));
        this.data = dt.map(x => x);
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    }
  }
};
</script>
