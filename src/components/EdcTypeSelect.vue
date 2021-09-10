<template>
  <q-select :options="edcTypes" v-model="selectedModel" v-bind="$attrs" />
</template>

<script>
export default {
  name: "EdcTypeSelect",
  inheritAttrs: false,
  props: {
    value: {
      type: Number,
      default: () => undefined
    }
  },
  data() {
    return {};
  },
  computed: {
    selectedModel: {
      get() {
        return !this.value
          ? undefined
          : this.edcTypes.find(x => x.id === this.value).label;
      },
      set(val) {
        var m = this.edcTypes.find(x => x.id === val.id);
        this.$emit("input", m.id);
      }
    },
    edcTypes() {
      return this.$store.state.list.edcTypes;
    }
  },
  methods: {},
  mounted() {}
};
</script>
