<template>
  <div>
    <page-header>
      <template #actions>
        <animal-types-btn flat round />
      </template>
    </page-header>
    <my-table
      title="Daily visits"
      :loading="loading"
      :data="data"
      row-key="id"
      :pagination.sync="pager"
      @refresh="fetch"
    >
      <template #actions>
        sdf
      </template>
    </my-table>
  </div>
</template>

<script>
export default {
  name: "DailyVisits",
  data() {
    return {
      date: new Date(),
      loading: false,
      data: [],
      pager: {
        rowsPerPage: 100,
        page: 1
      }
    };
  },
  methods: {
    async fetch() {
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.reports.getVisit(this.date);
        this.data = res.data;
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    }
  }
};
</script>
