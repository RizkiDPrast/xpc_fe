<template>
  <q-page>
    <page-header> </page-header>
    <q-tabs v-model="tab" active-color="primary">
      <q-tab :name="t" v-for="t in options" :key="t">
        {{ t.replace("Tab", "") }}
      </q-tab>
    </q-tabs>
    <q-tab-panels v-model="tab">
      <!-- <q-tab-panel v-for="t in options" :name="t" :key="t">
        <component :is="t" :name="t" />
      </q-tab-panel> -->
      <component v-for="t in options" :is="t" :name="t" :key="t" />

      <!-- <VisitsTab name="VisitsTab" key="VisitsTab" />
      <VisitsTab name="ProfitsTab" key="ProfitsTab" /> -->

      <!-- <ProfitsTab name="ProfitsTab" /> -->
      <!-- <component :is="'visits-tab'" :name="tab" /> -->
    </q-tab-panels>
  </q-page>
</template>
<script>
import VisitsTab from "./components/VisitsTab.vue";
import ProfitsTab from "./components/ProfitsTab.vue";
export default {
  name: "reports",
  components: {
    VisitsTab,
    ProfitsTab
  },
  data() {
    return {
      tab: "VisitsTab",
      options: ["VisitsTab", "ProfitsTab"]
    };
  }
};
</script>
