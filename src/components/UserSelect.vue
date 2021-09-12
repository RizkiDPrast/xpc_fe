<template>
  <q-select
    v-model="selected"
    :options="data"
    :loading="loading"
    @input="inputFn"
    :outlined="outlined"
    v-bind="$attrs"
    clearable
    :use-chips="multiple"
  />
</template>

<script>
export default {
  name: "user-select",
  inheritAttrs: false,
  props: {
    roleNames: {
      type: Array,
      default: () => []
    },
    outlined: {
      type: Boolean,
      default: () => false
    },
    value: {
      type: [Array, String],
      default: () => undefined
    }
  },
  data() {
    return {
      data: [],
      selected: undefined,
      loading: false
    };
  },
  computed: {
    multiple() {
      if (!this.$attrs) return false;
      return this.$attrs.multiple === "" ? true : this.$attrs.multiple || false;
    }
  },
  mounted() {
    this.onRequest();
  },
  watch: {
    value(newVal) {
      if (!this.data.length) {
        this.onRequest();
      } else {
        if (Array.isArray(newVal)) {
          this.selected = this.data.filter(x =>
            newVal.find(y => y.userId === x.userId)
          );
        } else {
          this.selected = this.data.find(x => x.value === newVal);
        }
      }
    }
  },
  // updated() {
  //   console.log("this.value", this.value);
  //   if (Array.isArray(this.value)) {
  //     this.selected = JSON.parse(JSON.stringify(this.value));
  //   } else if (this.value !== undefined && this.value !== "") {
  //     this.selected = this.data.find(x => x.value === this.value);
  //   }
  // },
  methods: {
    async onRequest() {
      if (this.loading) return;
      this.loading = true;
      try {
        const res = await this.$api.selectDatas.users({
          roleNames: this.roleNames
        });
        let data = res.data;
        if (Array.isArray(data)) {
          data = data.map(x => ({
            value: x.id,
            label:
              x.displayName && x.displayName !== null
                ? x.displayName
                : x.userName,
            sanitize: true,
            userId: x.id
          }));
          // `${x.displayName} <div class="q-badge flex inline items-center no-wrap q-badge--single-line" style="vertical-align: top;">${x.roleName}</div>`,

          this.data.splice(0, this.data.length, ...data);

          if (this.data.length) {
            if (Array.isArray(this.value)) {
              this.selected = this.data.filter(x =>
                this.value.find(y => y.userId === x.userId)
              );
            } else {
              this.selected = this.data.find(x => x.value === this.value);
            }
          } else {
            this.selected = undefined;
          }
        }
      } catch (e) {
        this.$toastr.error(e.message);
      }
      this.loading = false;
    },
    inputFn(val) {
      this.$emit("input", this.multiple ? val : val?.value);
      this.$emit("selected", this.selected);

    }
  }
};
</script>

<style></style>
