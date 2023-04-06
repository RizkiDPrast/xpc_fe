<template>
  <div class="">
    <q-select
      dense
      outlined
      v-bind="$attrs"
      :options="options"
      v-model="model"
      label="Closing Id"
      class="text-caption"
    >
      <q-tooltip
        content-class="bg-positive"
        anchor="top middle"
        self="bottom middle"
        :offset="[10, 10]"
      >
        Closing date - count of Sales | count of Cash In Outs | count of
        Deposits
      </q-tooltip>
    </q-select>
  </div>
</template>

<script>
export default {
  name: "SalesManagerSelect",
  props: {
    value: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      loading: false,
      options: []
    };
  },
  mounted() {
    this.fetch();
  },
  computed: {
    model: {
      get() {
        if (!this.options.length) return null;
        return this.options.find(x => x.id === this.value) || null;
      },
      set(val) {
        this.$emit("input", val.id);
        this.$emit("selected", val);
      }
    }
  },
  methods: {
    reset() {
      this.model = {};
    },
    async fetch() {
      if (this.loading) return;
      this.loading = true;
      try {
        const res = await this.$api.salesManagers.getSelectDataSimple();
        this.options = res.data.map(x => ({
          label: `${this.$util.toDateString(x.closingDate)} - ${
            x.countSales
          } | ${x.countCashInOuts} | ${x.countDeposits}`,
          id: x.id
        }));
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    }
  }
};
</script>
