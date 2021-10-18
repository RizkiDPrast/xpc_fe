<template>
  <q-input
    borderless
    dense
    readonly
    :value="label"
    :input-class="$attrs['input-class'] + ' text-center non-selectable'"
    class="non-selectable"
    style="width:175px"
    v-bind="$attrs"
  >
    <template #prepend>
      <q-btn
        flat
        round
        size="xs"
        icon="las la-chevron-left"
        @click="prev"
        :disable="!data.length || model.ix >= len - 1"
      />
    </template>
    <template #append>
      <q-btn
        flat
        round
        size="xs"
        icon="las la-chevron-right"
        @click="next"
        :disable="!data.length || model.ix <= 0"
      />
    </template>
  </q-input>
</template>
<script>
export default {
  name: "DatePrevNextSalesmanager",
  props: {},
  data() {
    return {
      tout: undefined,
      data: [],
      details: {},
      model: {},
      type: "day",
      loading: false,
      loadingDetails: false
    };
  },
  computed: {
    len() {
      return this.data.length;
    },
    label() {
      if (!this.model || !this.model.id) {
        return "-";
      }
      return this.$util.formatDate(this.model.createdAt, "MMM, DD YYYY");
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetchDetails() {
      if (this.loadingDetails) return;
      this.loadingDetails = true;
      this.$emit("loading", true);
      try {
        console.log(this.model);
        let res = await this.$api.salesManagers.getDetails(this.model.id);
        this.details = res.data;
        this.$emit("detail-fetched", this.details);
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loadingDetails = false;
      this.$emit("loading", false);
    },
    async fetch() {
      if (this.loading) return;
      this.loading = true;
      try {
        let res = await this.$api.salesManagers.get({ perPage: 50, page: 1 });
        this.data = res.data.map((x, i) => ({
          ix: i,
          createdAt: new Date(x.createdAt),
          ...x
        }));
        if (this.data.length) {
          this.model = this.data[0];
          this.fetchDetails();
        }
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    },
    prev() {
      let to = this.model.ix + 1;
      if (to >= this.len) return;
      this.model = this.data[to];

      if (this.tout) {
        clearTimeout(this.tout);
      }
      this.tout = setTimeout(() => {
        this.fetchDetails();
      }, 500);
    },
    next() {
      let to = this.model.ix - 1;
      if (to < 0) return;
      this.model = this.data[to];

      if (this.tout) {
        clearTimeout(this.tout);
      }
      this.tout = setTimeout(() => {
        this.fetchDetails();
      }, 500);
    }
  },
  destroyed() {
    clearTimeout(this.tout);
  }
};
</script>
