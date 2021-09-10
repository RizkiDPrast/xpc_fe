<template>
  <q-select
    ref="select"
    use-input
    v-bind="$attrs"
    input-debounce="500"
    v-model="selected"
    :options="data"
    :loading="isLoading"
    @filter="filterFn"
    clearable
    autocomplete="off"
    immediate
  />
</template>

<script>
export default {
  name: "supplier-select",
  inheritAttrs: false,
  props: {
    value: {
      type: Number,
      default: () => undefined
    }
  },
  data() {
    return {
      data: [],
      originalData: [],
      isLoading: false
    };
  },
  mounted() {
    this.onRequest();
  },
  computed: {
    selected: {
      get() {
        if (!this.value || !this.data.length) {
          return undefined;
        }
        return this.data.find(x => x.value === this.value);
      },
      set(val) {
        if (val && val.value) {
          this.$emit("input", val.value);
          this.$emit("selected", val);
        } else {
          this.$emit("input", undefined);
          this.$emit("selected", {});
        }
      }
    }
  },
  methods: {
    async onRequest(filter) {
      if (
        (!this.value || this.value < 1) &&
        (!filter || filter.trim() === "" || filter === null)
      ) {
        return;
      }
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        const res = await this.$api.selectDatas.suppliers({
          filter: filter || "",
          take: 10,
          Id: this.value
        });
        let data = res.data;
        if (Array.isArray(data)) {
          data = data.map(x => ({
            value: x.id,
            label: `${x.name}`,
            id: x.id,
            phones: x.phones,
            name: x.name,
            email: x.email,
            address: x.address,
            notes: x.notes
          }));
          this.data.splice(0, this.data.length, ...data);
          this.$refs.select.showPopup();
          if (this.value) {
            this.selected =
              this.data.find(x => x.value === this.value) || undefined;
          }
        } else {
          if (res.data.id) {
            this.data = [res.data];
            if (this.id === res.data.id) {
              this.selected = res.data;
            }
          }
        }
      } catch (e) {
        this.$toastr.error(e.message);
      }
      this.isLoading = false;
    },
    filterFn(val, update) {
      update(() => {
        this.onRequest(val);
      });
    }
  }
};
</script>

<style></style>
