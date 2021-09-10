<template>
  <q-page class="" style="">
    <page-header></page-header>
    <q-toolbar>
      <q-toolbar-title>
        Point of Sales
      </q-toolbar-title>
      {{ today() }}
    </q-toolbar>
    <div class="row">
      <div class="col-md-7 col-sm-6 col-xs-12 q-pa-md">
        <sales-today-list
          ref="sales"
          :deposits="deposits"
          @sales-closed="salesClosed"
        />
        <deposit-today-list @input="depositListHandle" ref="depositTodayList" />
      </div>
      <div
        class="col-md-5 col-sm-6 col-xs-12 q-py-md bg-white"
        style="position:relative;"
      >
        <add-sales @sales-saved="salesSaved" :clientId="clientId" />
      </div>
    </div>
  </q-page>
</template>

<script>
import SalesTodayList from "./components/SalesTodayList";
import DepositTodayList from "./components/DepositTodayList";
import AddSales from "./components/AddSales";
export default {
  name: "SalesToday",
  props: {
    clientId: {
      type: [String, Number],
      default: () => 0
    }
  },
  data() {
    return {
      deposits: []
    };
  },
  computed: {},
  watch: {},
  methods: {
    salesSaved(model) {
      this.$refs.sales.add(model);
    },
    depositListHandle(deposits) {
      this.deposits = deposits;
    },
    salesClosed() {
      this.$refs.depositTodayList.closeDeposit();
    }
  },
  components: {
    SalesTodayList,
    DepositTodayList,
    AddSales
  }
};
</script>
