<template>
  <q-card v-bind="$attrs">
    <q-toolbar>
      <q-toolbar-title> </q-toolbar-title>
      <q-btn flat round size="sm" icon="las la-sync" @click="fetch" />
      <date-prev-next type="year" v-model="year" />
    </q-toolbar>

    <q-card-section>
      <q-scroll-area style="height:400px;">
        <q-linear-progress v-if="loading" />
        <apexchart
          v-else
          width="100%"
          height="300px"
          style="min-width:400px!important"
          :options="options"
          :series="series"
        ></apexchart>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>
<script>
import DatePrevNext from "src/components/DatePrevNext.vue";
export default {
  components: { DatePrevNext },
  name: "SalesChartCard",
  data() {
    return {
      options: {
        title: {
          text: "Sales, Revenues, Purchases and Cash outs"
        },
        chart: {
          height: 350,
          type: "line",
          stacked: false
        },
        xaxis: {
          categories: undefined
        },
        stroke: {
          width: [1, 2, 2, 2],
          curve: "smooth"
        },
        plotOptions: {
          bar: {
            columnWidth: "50%"
          }
        },
        

        fill: {
          opacity: [1, 0.25, 0.65, 0.65],
          gradient: {
            inverseColors: false,
            shade: "dark",
            type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
          }
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        markers: {
          size: 1
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function(y) {
              if (typeof y !== "undefined") {
                return y.toLocaleString('id-ID');
              }
              return y;
            }
          }
        }
      },
      series: [
        {
          type: "column",
          name: "Sales",
          data: []
        },
        {
          type: "area",
          name: "Revenue",
          data: []
        },
        {
          type: "column",
          name: "Purchase",
          data: []
        },
        {
          type: "column",
          name: "Cash out",
          data: []
        }
      ],
      year: new Date(),
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

        this.options.xaxis.categories = this.months;
        let sales = res.data.sales;
        this.series[0].data = this.months.map((x, i) => {
          let dt = sales.find(s => s.month === i + 1);
          if (!dt) return 0;
          return dt.totalSales;
        });
        this.series[1].data = this.months.map((x, i) => {
          let dt = sales.find(s => s.month === i + 1);
          if (!dt) return 0;
          return dt.totalRevenue;
        });

        let purchases = res.data.purchases;
        this.series[2].data = this.months.map((x, i) => {
          let dt = purchases.find(s => s.month === i + 1);
          if (!dt) return 0;
          return dt.totalPurchase;
        });

        let cashOuts = res.data.cashOuts;
        this.series[3].data = this.months.map((x, i) => {
          let dt = cashOuts.find(s => s.month === i + 1);
          if (!dt) return 0;
          return -dt.totalCashOut;
        });

      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    }
  }
};
</script>
