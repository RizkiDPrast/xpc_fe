<template>
  <div>
    <sales-list all add-btn-class="hidden" />
  </div>
</template>

<script>
import DateInput from "src/components/DateInput.vue";
import SalesList from "src/pages/rooms/frontdesk/sales/components/SalesList.vue";
export default {
  components: { SalesList },
  name: "SalesTab",
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
  watch: {
    date() {
      this.fetch();
    }
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
