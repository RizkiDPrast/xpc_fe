<template>
  <q-page>
    <page-header />
    <q-toolbar>
      <q-btn flat icon="las la-arrow-left" @click="$router.back()" />
      <q-toolbar-title> </q-toolbar-title>
    </q-toolbar>
    <div class="row q-pa-md q-gutter-md">
      <import-data-card class="col-12" />

      <server-management-card class="col-12" />
    </div>
  </q-page>
</template>
<script>
import ImportDataCard from "./components/ImportDataCard.vue";
import ServerManagementCard from './components/ServerManagementCard.vue';
export default {
  components: { ImportDataCard, ServerManagementCard },
  name: "Utility",
  data() {
    return {};
  }
};
</script>
