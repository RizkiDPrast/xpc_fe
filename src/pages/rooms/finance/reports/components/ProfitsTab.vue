<template>
  <div>
    <q-toolbar>
      <q-toolbar-title> </q-toolbar-title>
      <month-btn v-model="date" />
    </q-toolbar>
    <div class="full-width full-height"></div>
  </div>
</template>
<script>
import MonthBtn from "./MonthBtn.vue";
export default {
  components: { MonthBtn },
  name: "ProfitTabs",
  data() {
    return {
      date: new Date()
    };
  },
  methods: {}
};
</script>
