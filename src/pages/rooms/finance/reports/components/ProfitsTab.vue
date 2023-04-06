<template>
  <div>
    <q-toolbar>
      <q-toolbar-title> </q-toolbar-title>
      <q-btn
        :disable="loading"
        icon="las la-sync"
        flat
        round
        @click="refresh"
      />
      <month-btn v-model="date" :defaultView="defaultView" ref="mbtn">
        <template v-slot:label>
          Show
          <!-- <q-btn-toggle
            flat
            v-model="filter"
            :options="[
              { label: 'Daily', value: 'daily' },
              { label: 'Monthly', value: 'monthly' }
            ]"
          /> -->
          <q-toggle
            keep-color
            color="red"
            v-model="filter"
            true-value="daily"
            false-value="monthly"
          >
            <template>
              <span class="text-red">
                {{ filter }}
              </span>
            </template>
          </q-toggle>
          report @
        </template>
      </month-btn>
    </q-toolbar>
    <div class="full-width full-height">
      <section-summary
        ref="ssum"
        :startDate="startDate"
        :endDate="endDate"
        :label="label"
      />
      <section-penerimaan
        ref="p1"
        :startDate="startDate"
        :endDate="endDate"
        :label="label"
      />
      <section-pengeluaran
        ref="p2"
        :startDate="startDate"
        :endDate="endDate"
        :label="label"
      />
    </div>
  </div>
</template>
<script>
import SalesReport from "./components/RevenueReport.vue";
import SectionPenerimaan from "./components/SectionPenerimaan.vue";
import SectionPengeluaran from "./components/SectionPengeluaran.vue";
import SectionSummary from "./components/SectionSummary.vue";
import MonthBtn from "./MonthBtn.vue";

export default {
  components: { MonthBtn },
  name: "RevenueTabs",
  components: {
    SalesReport,
    MonthBtn,
    SectionPenerimaan,
    SectionPengeluaran,
    SectionSummary
  },
  data() {
    return {
      date: new Date(),
      filter: "daily", // daily | monthly
      loading: false,
      label: ""
    };
  },
  computed: {
    defaultView() {
      return this.filter === "daily" ? "Months" : "Years";
    },
    startDate() {
      const d = this.date;
      if (this.defaultView === "Years") {
        return new Date(d.getFullYear(), 0, 1);
      }
      return new Date(d.getFullYear(), d.getMonth(), 1);
    },
    endDate() {
      const d = this.date;
      if (this.defaultView === "Years") {
        const d1 = new Date(d.getFullYear() + 1, 0, 1);
        d1.setSeconds(-1);
        return d1;
      }
      const d1 = new Date(d.getFullYear() + 1, d.getMonth() + 1, 1);
      d1.setSeconds(-1);
      return d1;
    }
  },
  watch: {
    startDate() {
      this.label = this.$refs.mbtn?.label || "";
    }
  },
  methods: {
    refresh() {
      this.$refs.ssum?.fetch();
      this.$refs.p1.refresh();
      this.$refs.p2?.refresh();
    }
  }
};
</script>
