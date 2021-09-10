<template>
  <q-select
    v-model="model"
    :value="model"
    @input="input"
    :options="options"
    :disable="$attrs.disable || loading"
    v-bind="$attrs"
    clearable
    use-input
    @filter="filterFn"
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
    },
    ignore: {
      type: Array,
      default: () => []
    },
    include: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      filter: undefined
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
      var ifun = typeof this.ignore === "function";
      var dt = this.data
        .filter(x => {
          if (this.ignore.length) {
            return this.ignore.indexOf(x.id) === -1;
          }

          if (this.include.length) {
            return this.include.indexOf(x.id) > -1;
          }

          return true;
        })
        .map(x => x.name);
      return dt;
    },
    data() {
      let dt = [...this.$store.state.list.units].sort((a, b) =>
        a.name > b.name ? 1 : 0
      );
      if (!this.filter) {
        return dt;
      }
      let val = this.filter.toLowerCase();
      return dt.filter(x => x.name.toLowerCase().indexOf(val) > -1);
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
        let res = await this.$api.units.get();
        // this.data = res.data;
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    },
    input(val) {
      this.model = val;
    },
    filterFn(val, update, abort) {
      update(() => {
        this.filter = val;
      });
    }
  }
};
</script>
