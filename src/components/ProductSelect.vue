z<template>
  <q-select
    :options="productSelectData"
    v-model="selectedProduct"
    :loading="isLoading"
    input-debounce="500"
    use-input
    @filter="filterProductSelect"
    v-bind="$attrs"
    clearable
  />
</template>

<script>
export default {
  name: "ProductSelect",
  inheritAttrs: false,
  props: {
    value: {
      type: Number,
      default: () => undefined
    },
    showAll: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      isLoading: false,
      productSelectData: []
    };
  },
  computed: {
    selectedProduct: {
      get() {
        return this.productSelectData.length
          ? this.productSelectData.find(x => x.value === this.value)
          : undefined;
      },
      set(val) {
        if (val && val.value) {
          this.$emit("input", val.value);
          this.$emit("selectedChanged", val);
        } else {
          this.$emit("input", undefined);
          this.$emit("selectedChanged", {});
        }
      }
    }
  },
  watch: {
    value(val) {
      this.fetchProductSelectData();
    }
  },
  methods: {
    async fetchProductSelectData(val) {
      if ((!val || !val.length) && !this.value) {
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      try {
        var res = await this.$api.selectDatas.products({
          id: this.value,
          filter: val,
          inStockOnly: !this.showAll
        });
        this.productSelectData = res.data;
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
      this.isLoading = false;
    },
    async filterProductSelect(val, doneFn) {
      if (!val || !val.length) {
        return;
      }
      await this.fetchProductSelectData(val);
      doneFn(() => {});
    }
  },
  mounted() {
    this.fetchProductSelectData();
  }
};
</script>
