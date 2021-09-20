<template>
<div>
  <q-card>
    <q-toolbar>
      <q-toolbar-title> </q-toolbar-title>
      <q-btn flat round size="sm" icon="las la-sync" @click="fetch" />
      <date-prev-next type="year" v-model="year" />
    </q-toolbar>
    <q-card-section>
      <apexchart :options="options" :series="options.series" />
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
          height: 250,
          width: "100%",
          stacked: true,
          foreColor: "#999"
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
            name: "New visit",
            data: [
              20,
              16,
              24,
              28,
              26,
              22,
              15,
              5,
              14,
              16,
              22,
              29,
              24,
              19,
              15,
              10,
              11,
              15,
              19,
              23
            ]
          },
          {
            name: "All visit",
            data: [
              20,
              16,
              24,
              28,
              26,
              22,
              15,
              5,
              14,
              16,
              22,
              29,
              24,
              19,
              15,
              10,
              11,
              15,
              19,
              23
            ]
          }
        ],
        labels: [
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          1,
          2,
          3,
          4
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
            show: false,
            style: {
              fontSize: "14px"
            }
          }
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
            show: false
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
          text: "Total and new client"
        },
        tooltip: {
          shared: true,
          intersect: false
        }
      }
    };
  },
  methods: {
    fetch() {}
  }
};
</script>
