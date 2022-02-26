<template>
  <q-select v-bind="$attrs" :options="options" v-model="model" />
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
    async fetch() {
      if (this.loading) return;
      this.loading = true;
      try {
        const res = await this.$api.salesManagers.getSelectData();
        this.options = res.data;
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    }
  }
};
</script>
