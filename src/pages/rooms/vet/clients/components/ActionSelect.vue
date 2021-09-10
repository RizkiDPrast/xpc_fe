<template>
  <q-select
    v-model="model"
    :value="model"
    @input="input"
    :options="options"
    :disable="loading"
    v-bind="$attrs"
  >
    <template v-for="(_, slot) in $slots" v-slot:[slot]>
      <slot :name="slot"> </slot>
    </template>
  </q-select>
</template>
<script>
export default {
  props: {
    value: {
      type: [Number, String],
      default: () => undefined
    }
  },
  data() {
    return {
      loading: false,
      data: []
    };
  },
  computed: {
    model: {
      get() {
        var dt = this.data.find(x => x.value === this.value);
        if (!dt) return undefined;
        return dt.label;
      },
      set(val) {
        var dt = this.data.find(x => x.label === val);
        if (dt) {
          val = dt.value;
        }
        this.$emit("input", val);
      }
    },
    options() {
      return this.data.map(x => x.label);
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch() {
      if (this.loading) return;
      this.loading = true;
      try {
        this.data = this.$store.state.list.signalementActions;
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    },
    input(val) {
      this.model = val;
    }
  }
};
</script>
