<template>
  <q-select v-bind="$attrs" :options="options" v-model="model" />
</template>

<script>
export default {
  name: "PaymentTypeSelect",
  props: {
    value: {
      type: [String, Number],
      default: () => null
    }
  },
  data() {
    return {
      isLoading: false,
      options: []
    };
  },
  computed: {
    model: {
      get() {
        if (!this.options) return null;
        return this.options.find(x => x.value === this.value);
      },
      set(val) {
        this.$emit("input", val?.value);
      }
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
    fetch() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        this.options = [
          { label: "Tunai", value: 0 },
          { label: "Debit Card", value: 1 },
          { label: "Credit Card", value: 2 },
          { label: "Transfer", value: 3 }
        ];
      } catch (error) {
        this.$toastr.error(error);
      }
      this.isLoading = false;
    }
  }
};
</script>
