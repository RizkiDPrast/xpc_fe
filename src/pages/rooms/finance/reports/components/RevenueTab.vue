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
      <month-btn v-model="date" :defaultView="defaultView" />
    </q-toolbar>
    <q-banner class="bg-warning">
      <q-icon class="las la-exclamation-circle"></q-icon> Only sale and deposit
      transactions from
      <router-link to="/app/rooms/sales">POS Sales menu</router-link> will be
      counted.
    </q-banner>
    <div class="full-width full-height">
      <q-tabs v-model="tab" class="text-teal">
        <q-tab
          name="daily"
          icon="las la-calendar-check"
          label="Daily"
          no-caps
        />
        <q-tab name="monthly" icon="las la-calendar" label="Monthly" no-caps />
      </q-tabs>
      <q-tab-panels v-model="tab">
        <q-tab-panel name="daily">
          <RevenueReport :group="tab" :date="date" @loading="setLoading" />
        </q-tab-panel>
        <q-tab-panel name="monthly">
          <RevenueReport :group="tab" :date="date" @loading="setLoading" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
<script>
import RevenueReport from "./components/RevenueReport.vue";
import MonthBtn from "./MonthBtn.vue";

export default {
  components: { MonthBtn },
  name: "ProfitTabs",
  components: {
    RevenueReport,
    MonthBtn
  },
  data() {
    return {
      date: new Date(),
      tab: "daily",
      loading: false
    };
  },
  computed: {
    defaultView() {
      return this.tab === "daily" ? "Months" : "Years";
    }
  },
  methods: {
    setLoading(val) {
      this.loading = val;
    },
    refresh() {
      var temp = new Date(this.date);
      this.date = temp;
    }
  }
};
</script>
