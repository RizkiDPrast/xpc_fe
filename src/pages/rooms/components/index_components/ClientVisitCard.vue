<template>
  <div>
    <q-card>
      <q-toolbar>
        <q-toolbar-title> </q-toolbar-title>
        <q-btn
          flat
          round
          size="sm"
          icon="las la-sync"
          @click="fetch"
          :disable="loading"
        />
        <date-prev-next type="year" v-model="year" />
      </q-toolbar>
      <q-card-section style="height:735px">
        <q-linear-progress v-if="loading" />
        <q-scroll-area v-else style="width:100%;height:700px">
          <apexchart :options="options" :series="options.series" />
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
export default {
  name: "ClientVisitCard",
  data() {
    return {
      loading: false,
      year: new Date(),
      options: {
        chart: {
          type: "bar",
          height: 500,
          width: "100%",
          stacked: true,
          foreColor: "#999",      
          
        // toolbar: {
        //     show: true,
        //      offsetX: 0,
        //     offsetY: 0,
        //     tools: {
        //       download: true,
        //       selection: true,
        //       zoom: true,
        //       zoomin: true,
        //       zoomout: true,
        //       pan: true,
        //       reset: true | '<img src="/static/icons/reset.png" width="20">',
        //       customIcons: []
        //     },
        //     autoselect: 'zoom'
        //   }              
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: false
            },
            columnWidth: "75%",
            endingShape: "rounded"
          }
        },
        colors: ["#00C5A4", "#F3F2FC"],
        series: [
          {
            name: "New Visit",
            data: [0, 20, 16, 24, 28, 26, 22, 15, 5, 14, 16, 23]
          },
          {
            name: "Regular visit",
            data: [0, 0, 0, 20, 16, 24, 28, 26, 22, 15, 5, 14]
          }
        ],
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        xaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            show: false
          },
          labels: {
            show: true,
            style: {
              fontSize: "14px"
            }
          },
        },
        grid: {
          xaxis: {
            lines: {
              show: false
            }
          },
          yaxis: {
            lines: {
              show: false
            }
          }
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          labels: {
            show: true
          }
        },
        legend: {
          floating: true,
          position: "top",
          horizontalAlign: "right",
          offsetY: -36
        },
        title: {
          text: "Client visit",
          align: "left"
        },
        subtitle: {
          text: "New visits and Regular visits"
        },
        tooltip: {
          shared: true,
          intersect: false
        },
      }
    };
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
    year() {
      this.fetch();
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch() {
      if (!this.year) return;
      if (this.loading) return;
      this.loading = true;
      try {
        let res = await this.$api.dashboard.getVisitData(
          this.year.getFullYear()
        );
        console.log("res.data", res.data);
        let dt = res.data;
        this.options.series[0].data = this.months.map((x, i) => {
          let f = dt.find(y => y.month === i + 1);
          if (f) {
            return f.newClient;
          }
          return 0;
        });
        this.options.series[1].data = this.months.map((x, i) => {
          let f = dt.find(y => y.month === i + 1);
          if (f) {
            return f.newClient > f.count ? 0 : f.count - f.newClient;
          }
          return 0;
        });
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    }
  }
};
</script>
