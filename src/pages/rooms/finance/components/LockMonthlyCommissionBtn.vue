<template>
  <div>
    <q-btn
      v-bind="$attrs"
      :loading="loading"
      :disable="disable"
      @click.stop="click"
    >
      <slot></slot>
      <!-- {{ forMonthLabel }} Commission -->
      Show Monthly Locks
    </q-btn>
    <q-dialog v-model="dialog" position="top">
      <lock-list />
    </q-dialog>
  </div>
</template>
<script>
import LockList from "./LockList.vue";
export default {
  components: { LockList },
  name: "LockMonthlyCommissionBtn",
  data() {
    return {
      loading: false,
      date: new Date(),
      dialog: false
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
      this.dialog = !this.dialog;
    }
  }
};
</script>
