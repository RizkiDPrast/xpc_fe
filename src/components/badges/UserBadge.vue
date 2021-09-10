<template>
  <q-badge v-bind="$attrs" v-if="loading || user.id">
    <my-circular-progress size="xs" v-if="loading" />
    <span v-else>
      {{
        user.displayName && user.displayName !== null
          ? user.displayName
          : user.userName
      }}
    </span>
  </q-badge>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: () => undefined
    }
  },
  data() {
    return {
      loading: false,
      user: {}
    };
  },
  mounted() {
    this.fetch();
  },
  watch: {
    id(val) {
      this.fetch();
    }
  },
  methods: {
    async fetch() {
      if (!this.id) {
        this.user = {};
        return;
      }
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.users.getOne(this.id);
        this.user = res.data;
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
      this.loading = false;
    }
  }
};
</script>
