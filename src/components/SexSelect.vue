<template>
  <q-select
    v-model="model"
    :value="model"
    @input="input"
    :options="options"
    :disable="loading"
    v-bind="$attrs"
    clearable
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
        if (!this.value) return undefined;
        var dt = this.data.find(x => x.id === this.value);
        if (!dt) return undefined;
        return dt.name;
      },
      set(val) {
        var dt = this.data.find(x => x.name === val);
        if (dt) {
          val = dt.id;
        }
        this.$emit("input", val);
      }
    },
    options() {
      return this.data.map(x => x.name);
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
        this.data = this.$store.state.list.sexTypes;
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
