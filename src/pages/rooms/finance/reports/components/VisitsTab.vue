<template>
  <div>
    <my-table
      title="Daily client visits"
      :loading="loading"
      :data="data"
      row-key="id"
      :pagination.sync="pager"
      @refresh="fetch"
      add-btn-class="hidden"
    >
      <template #actions>
        <date-input v-model="date" dense label="Pick date" />
        <div style="width:12px" />
      </template>
      <template #body-cell-signalements="props">
        <q-td
          align="left"
          v-html="
            props.row.signalements &&
              props.row.signalements != null &&
              props.row.signalements.replaceAll('\n', '<br>')
          "
        >
        </q-td>
      </template>
      <template #body-cell-sales="props">
        <q-td
          align="left"
          v-html="
            props.row.sales &&
              props.row.sales != null &&
              props.row.sales.replaceAll('\n', '<br>')
          "
        >
        </q-td>
      </template>
    </my-table>
  </div>
</template>

<script>
import DateInput from "src/components/DateInput.vue";
export default {
  components: { DateInput },
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
