<template>
  <div class="row">
    <div class="col-4">
      <span v-if="!includeSalesManagerList">Pick date ranges:</span>
      <sales-manager-select v-model="salesManagerId" v-else ref="sm" />
    </div>
    <div class="col-4">
      <date-input
        v-model="date1"
        v-bind="$attrs"
        outlined
        label="Date from"
        stack-label
      />
    </div>
    <div class="col-4">
      <date-input
        v-model="date2"
        v-bind="$attrs"
        outlined
        label="Date To"
        stack-label
        :disable="!date1"
        :options="date2Options"
      />
    </div>
  </div>
</template>

<script>
import SalesManagerSelect from "./SalesManagerSelect.vue";
export default {
  name: "DateRangeInput",
  inheritAttrs: false,
  components: {
    SalesManagerSelect
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    includeSalesManagerList: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      dateFormat: "YYYY/MM/DD",
      salesManagerId: null
    };
  },
  watch: {
    salesManagerId(nval) {
      this.$emit("salesManagerIdUpdate", nval);
    }
  },
  computed: {
    date1: {
      get() {
        return !this.value.length
          ? undefined
          : this.value.reduce((a, b) => (a > b ? b : a));
      },
      set(val) {
        var arr = [this.$util.formatDate(val, this.dateFormat)];
        if (this.value.length > 1) {
          arr.push(this.value[1]);
        }
        this.$emit("input", arr);
      }
    },
    date2: {
      get() {
        return this.value.length < 2
          ? undefined
          : this.value.reduce((a, b) => (a > b ? a : b));
      },
      set(val) {
        var arr = [];
        var d2 = this.$util.formatDate(val, this.dateFormat);
        if (this.value.length) {
          arr.push(this.value[0]);
        } else {
          arr.push(d2);
        }
        arr.push(d2);
        this.$emit("input", arr);
      }
    }
  },
  methods: {
    reset() {
      // this.date1 = undefined;
      // this.date2 = undefined;
      this.$refs.sm.reset();
    },
    date2Options(val) {
      return val >= this.date1;
    }
  }
};
</script>
