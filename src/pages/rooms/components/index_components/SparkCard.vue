<template>
  <div style="min-height:100px">
    <q-linear-progress v-if="loading" />
    <apexchart v-else :options="options" :series="options.series"></apexchart>
  </div>
</template>
<script>
import { boot } from "quasar/wrappers";
export default {
  name: "SparkCard",
  props: {
    loading: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => ""
    },
    subtitle: {
      type: String,
      default: () => ""
    },
    color: {
      type: String,
      default: () => "#DCE6EC"
    }
  },
  watch: {
    loading(val) {},
    title(val) {
      this.options.title.text = val;
    },
    subtitle(val) {
      this.options.subtitle.text = val;
    }
  },
  data() {
    return {
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
          }
        },
        tooltip: { enabled: false },
        stroke: {
          curve: "straight"
        },
        fill: {
          opacity: 0.2
        },
        yaxis: {
          min: 0
        },
        colors: [this.color],
        title: {
          text: this.title,
          offsetX: 0,
          style: {
            fontSize: "24px",
            color: this.color
          }
        },
        subtitle: {
          text: this.subtitle,
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
  },
  mounted() {}
};
</script>
