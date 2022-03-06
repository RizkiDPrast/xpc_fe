<template>
  <q-select
    :options="selectData"
    v-model="selectedData"
    :loading="isLoading"
    v-bind="$attrs"
    clearable
    use-input
    @filter="filterFn"
    class="block"
    input-style="width:2px;"
  />
</template>

<script>
export default {
  name: "AccountSelect",
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: () => undefined
    },
    accountTypes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isLoading: false,
      selectData: [],
      oriDatas: []
    };
  },
  computed: {
    selectedData: {
      get() {
        return this.selectData.length
          ? this.selectData.find(x => x.value === this.value)
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
  methods: {
    async fetchselectData(val) {
      if ((!val || !val.length) && this.value < 0) {
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      try {
        var res = await this.$api.gl.getAccounts();
        this.selectData = res.data.map(x => ({
          id: x.id,
          value: x.code,
          label:
            (x.parent ? `[${x.parent.name}]` : "[]") +
            " " +
            x.code +
            " " +
            x.name,
          accountType: x.accountType
        }));
        console.log("this.accountTypes", this.accountTypes);
        if (this.accountTypes.length) {
          console.log(this.selectData);
          this.selectData = this.selectData.filter(
            x => this.accountTypes.findIndex(y => y === x.accountType) > -1
          );
        }
        this.oriDatas = JSON.parse(JSON.stringify(this.selectData));
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
      this.isLoading = false;
    },
    async filterFn(val, update) {
      if (!val || !val.length) {
        update(() => {
          this.selectData = this.$util.extend([], this.oriDatas);
        });
      } else {
        update(() => {
          const lval = val.toLowerCase();
          const dt = this.oriDatas.filter(
            x => x.label.toLowerCase().indexOf(lval) > -1
          );
          this.selectData = dt;
        });
      }
    }
  },
  mounted() {
    this.fetchselectData();
  }
};
</script>

<style>
.block
  .q-field__control-container.col.relative-position.row.no-wrap.q-anchor--skip
  .q-field__native.row.items-center {
  display: inline;
}
</style>
