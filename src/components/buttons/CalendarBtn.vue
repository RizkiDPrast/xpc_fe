<template>
  <span>
    <q-btn
      v-bind="$attrs"
      v-on="$listeners"
      flat
      round
      icon="las la-calendar"
      to="/app/rooms/calendar"
    >
      <q-badge color="red" style="top:-5px;" floating v-if="this.count > 0">{{
        this.count
      }}</q-badge>

      <q-tooltip content-class="bg-secondary">
        Manage appointments
        <template v-if="this.count">
          <br />
          <span> {{ this.count }} appointment(s) near due date</span>
        </template>
      </q-tooltip>
    </q-btn>
  </span>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {},
  data() {
    return {
      count: 0
    };
  },
  methods: {
    async getCount() {
      try {
        let res = await this.$api.appointments.getCount();
        this.count = Number(res.data);
      } catch (error) {
        this.$toastr.error(error);
      }
    }
  },
  mounted() {
    this.getCount();
  }
};
</script>
