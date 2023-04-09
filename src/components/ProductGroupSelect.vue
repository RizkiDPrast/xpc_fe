<template>
  <q-select v-bind="$attrs" :options="options" v-model="model" />
</template>

<script>
export default {
  name: "ProductGroupSelect",
  props: {
    value: {
      type: String,
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
        if (!this.value) return null;

        return this.options.find(x => x.value === this.value);
      },
      set(val) {
        this.$emit("input", val?.value?.replaceAll(" ", "_"));
      }
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        const res = await this.$api.products.getProductGroups();
        console.log(res.data, this.value);
        this.options = res.data.map(x => ({
          label: x.replaceAll("_", " "),
          value: x
        }));
        console.log("res.data", res.data);
      } catch (error) {
        this.$toastr.error(error);
      }
      this.isLoading = false;
    }
  }
};
</script>
