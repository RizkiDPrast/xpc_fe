<template>
  <q-page>
    <page-header> </page-header>
    <q-tabs v-model="tab" active-color="primary">
      <q-tab :name="t" v-for="t in options" :key="t">
        {{ t.replace("Tab", "") }}
      </q-tab>
    </q-tabs>
    <q-tab-panels v-model="tab">
      <q-tab-panel v-for="t in options" :name="t" :key="t">
        <component :is="t" :name="t" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
<script>
import VisitsTab from "./components/VisitsTab.vue";
export default {
  name: "reports",
  components: {
    VisitsTab,
    ProfitsTab: () => import("./components/ProfitsTab.vue"),
    SalesTab: () => import("./components/SalesTab.vue")
  },
  data() {
    return {
      tab: "VisitsTab",
      options: ["VisitsTab", "SalesTab", "ProfitsTab"]
    };
  }
};
</script>
