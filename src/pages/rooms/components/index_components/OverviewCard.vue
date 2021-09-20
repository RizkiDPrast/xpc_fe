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
      <SparkSalesCard class="col-sm-12 col-md-6"/>
      <SparkSalesCard class="col-sm-12 col-md-6"/>
      <SparkSalesCard class="col-sm-12 col-md-6"/>
      <SparkSalesCard class="col-sm-12 col-md-6"/>
    </q-card-section>
  </q-card>
</div>
</template>
<script>
import DatePrevNext from "src/components/DatePrevNext.vue";
import SparkSalesCard from './SparkSalesCard.vue'
export default {
  components: { DatePrevNext,SparkSalesCard },
  name: "OverviewCards",
  data() {
    return {     
      month: new Date(),
      loading: false
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
        console.log("asdasd", i, d);
        arr.push(d);
      }
      console.log("arr", arr);

      return arr;
    }
  },
  watch: {
    year() {
      this.fetch();
    }
  },
  methods: {
    async fetch() {
      if (!this.year) return;
      if (this.loading) return;
      this.loading = true;
      try {
        let res = await this.$api.dashboard.getSalesData(
          this.year.getFullYear()
        );
        console.log("res.data", res.data);

        // this.options.xaxis.categories = this.months;
        // let sales = res.data.sales;
        // this.series[0].data = this.months.map((x, i) => {
        //   let dt = sales.find(s => s.month === i + 1);
        //   if (!dt) return 0;
        //   return dt.totalSales;
        // });
        // this.series[1].data = this.months.map((x, i) => {
        //   let dt = sales.find(s => s.month === i + 1);
        //   if (!dt) return 0;
        //   return dt.totalRevenue;
        // });

        // let purchases = res.data.purchases;
        // this.series[2].data = this.months.map((x, i) => {
        //   let dt = purchases.find(s => s.month === i + 1);
        //   if (!dt) return 0;
        //   return dt.totalPurchase;
        // });

        // let cashOuts = res.data.cashOuts;
        // this.series[3].data = this.months.map((x, i) => {
        //   let dt = cashOuts.find(s => s.month === i + 1);
        //   if (!dt) return 0;
        //   return -dt.totalCashOut;
        // });

        console.log(this.series);
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    }
  }
};
</script>
