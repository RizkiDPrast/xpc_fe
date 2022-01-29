<template>
  <q-card>
    <q-toolbar>
      <q-toolbar-title>
        Monthly report<br />
        {{ label }}
      </q-toolbar-title>
    </q-toolbar>
  </q-card>
</template>
<script>
export default {
  name: "SalesCard",
  props: {
    date: {
      type: [String, Date],
      default: () => null
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    label() {
      if (!this.dateModel || !this.$util.isValid(this.dateModel)) {
        return "- select month -";
      }
      return this.$util.formatDate(this.dateModel, "MMMM YYYY");
    },
    validDate() {
      return this.$util.isValid(this.date);
    }
  },
  methods: {
    async fetch() {
      if (!this.validDate) return;
      if (this.loading) return;
      this.loading = true;
      try {
        // let data = await this.$api.
      } catch (error) {}
      this.loading = false;
    }
  },
  watch: {
    date() {
      this.fetch();
    }
  }
};
</script>
