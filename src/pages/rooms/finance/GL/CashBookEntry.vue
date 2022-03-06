<template>
  <q-page class="q-pa-md" style="">
    <page-header />
    <BookEntryList v-if="true" />
  </q-page>
</template>

<script>
import PageHeader from "src/components/PageHeader.vue";
import BookEntryList from "./components/BookEntryList.vue";
export default {
  name: "CashBookEntryList",
  data() {
    return {
      isLoading: false
    };
  },
  computed: {},
  mounted() {},
  methods: {},
  components: {
    BookEntryList,
    PageHeader
  }
};
</script>
