<template>
  <div>
    <q-linear-progress v-if="loading" />
    <apexchart v-else :options="options" :series="options.series"></apexchart>
  </div>
</template>
<script>
export default {
  name: "SparkSalesCard",
  data() {
    return {
      loading: false,
      options: {
        series: [
          {
            data: this.randomizeArray()
          }
        ],
        chart: {
          type: "area",
          height: 160,
          sparkline: {
            enabled: true
          },
        },
        tooltip: {enabled: false},
        stroke: {
          curve: "straight"
        },
        fill: {
          opacity: 0.3
        },
        yaxis: {
          min: 0
        },
        colors: ["#DCE6EC"],
        title: {
          text: "$424,652",
          offsetX: 0,
          style: {
            fontSize: "24px"
          }
        },
        subtitle: {
          text: "Sales",
          offsetX: 0,
          style: {
            fontSize: "14px"
          }
        }
      }
    };
  },
  methods: {
    randomizeArray() {
      let arr = [];
      for (let i = 0; i < 25; i++) {
        arr.push(Math.random() * 100);
      }
      return arr;
    }
  }
};
</script>
