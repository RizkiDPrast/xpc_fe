<template>
  <div>
    <q-btn
      v-bind="$attrs"
      :loading="loading"
      :disable="disable"
      @click.stop="click"
    >
      <slot></slot>
      {{ forMonthLabel }} Commission
    </q-btn>
    <q-tooltip content-class="bg-negative">
      Lock monthly commission<br />
      (will be active before 11th and after or equal 25th of every month)
    </q-tooltip>
  </div>
</template>
<script>
export default {
  name: "LockMonthlyCommissionBtn",
  data() {
    return {
      loading: false,
      date: new Date()
    };
  },
  computed: {
    disable() {
      return this.date.getDate() > 10 && this.date.getDate() < 25;
    },
    forMonthLabel() {
      var t = new Date(this.date);
      if (this.date.getDate() < 25) {
        t.setMonth(-1);
      }
      return this.$util.formatDate(t, "MMMM");
    }
  },
  methods: {
    async click() {
      if (this.loading) return;
      this.loading = true;
      var d = new Date();
      if (d.getDate() < 10) {
        d.setMonth(d.getMonth() - 1);
      }
      var f = this.$util.formatDate(d, "MMMM YYYY");
      if (
        await this
          .confirm(`This action will lock <b>${f}</b> commission. This will affect following:\n
            <ul>
                <li>User commission datas for the spesified month</li>
                <li>TreatedBy, GroomedBy, and AssistedBy fields in Signalement table created at the spesified month</li>
                <li>In-patient-treatment-board datas commission for the spesified month</li>
            </ul>\nContinue?`)
      ) {
        try {
          await this.$api.finance.lockMonthlyCommissions(d);
          this.$toastr.success("Records was updated");
        } catch (error) {
          this.$toastr.error(error);
        }
      }
      this.loading = false;
    }
  }
};
</script>
