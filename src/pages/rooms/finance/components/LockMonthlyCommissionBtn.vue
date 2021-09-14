<template>
  <div>
    <q-btn
      v-bind="$attrs"
      :loading="loading"
      :disable="disable"
      @click.stop="click"
    >
      <slot></slot>
    </q-btn>
    <q-tooltip content-class="bg-negative">
      Lock monthly commission<br />
      (will be active after the 25th of every month)
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
      return false //this.date.getDate() < 25;
    }
  },
  methods: {
    async click() {
        if(this.loading) return;
        this.loading = true
      if (
        await this.confirm(`This action will do following:\n
            <ul>
                <li>Lock all unlocked User commission datas</li>
                <li>Lock all unlocked TreatedBy, GroomedBy, and AssistedBy fields in Signalement table</li>
                <li>Lock all unlocked  In-patient-treatment-board datas</li>
            </ul>\nContinue?`)
      ) {
          await this.$api.finance.lockMonthlyCommissions()
          this.$toastr.success('Records was updated')
      }
      this.loading = false
    }
  }
};
</script>
