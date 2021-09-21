<template>
<div>
  <q-card v-bind="$attrs">
    <q-toolbar>
      <q-toolbar-title class="text-h6"> 
        Insights
      </q-toolbar-title>
      <q-btn flat round size="sm" icon="las la-sync" @click="fetch" />
      <date-prev-next type="month" v-model="month" />
    </q-toolbar>

    <q-card-section class="row q-col-gutter-md">
      <SparkCard color="#0068b9" :loading="loading" :title="sales.title" :subtitle="sales.subtitle" class="col-sm-12 col-md-6"/>
      <SparkCard color="#ff8697" :loading="loading" :title="unpaids.title" :subtitle="unpaids.subtitle" class="col-sm-12 col-md-6"/>
      <SparkCard color="#e7c95f" :loading="loading" :title="purchases.title" :subtitle="purchases.subtitle" class="col-sm-12 col-md-6"/>
      <SparkCard  :loading="loading" :title="cashOuts.title" :subtitle="cashOuts.subtitle" class="col-sm-12 col-md-6"/>
    </q-card-section>
  </q-card>
</div>
</template>
<script>
import DatePrevNext from "src/components/DatePrevNext.vue";
import SparkCard from './SparkCard.vue'
export default {
  components: { DatePrevNext,SparkCard },
  name: "OverviewCards",
  data() {
    return {     
      month: new Date(),
      loading: false,
      sales:{
        subtitle: 'Sales',
      },
      unpaids:{
        subtitle: 'Unpaid',
      },
      purchases:{
        subtitle: 'Purchases',
      },
      cashOuts:{
        subtitle: 'CashOuts',
      }
    };
  },
  mounted() {
    this.fetch();
  },
  computed: {
    months() {
      let arr = [];

      for (let i = 0; i < 12; i++) {
        let d = new Date(
          `2021-${(i + 1).toString().padStart(2, "0")}-01T00:00:00`
        )
          .toString()
          .split(" ")[1];
        arr.push(d);
      }

      return arr;
    }
  },
  watch: {
    month() {
      this.fetch();
    }
  },
  methods: {
    async fetch() {
      if (!this.month) return;
      if (this.loading) return;
      this.loading = true;
      try {
        let res = await this.$api.dashboard.getInsightData(
          this.month
        );

        let dt = res.data;
        this.sales.title = this.$options.filters.money(dt.sales?.total)
        this.sales.subtitle = `Sales (${dt.sales?.count || 0})`

        this.unpaids.title = this.$options.filters.money(dt.unpaids?.total)
        this.unpaids.subtitle = `Unpaids (${dt.unpaids?.count || 0})`

        this.purchases.title = this.$options.filters.money(dt.purchases?.total)
        this.purchases.subtitle = `Purchases (${dt.purchases?.count || 0})`

        this.cashOuts.title = this.$options.filters.money(dt.cashOuts?.total)
        this.cashOuts.subtitle = `Cash outs (${dt.cashOuts?.count || 0})`

      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    }
  }
};
</script>
