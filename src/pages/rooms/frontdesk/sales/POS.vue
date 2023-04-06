<template>
  <q-page class="" style="">
    <page-header></page-header>
    <q-toolbar>
      <q-toolbar-title>
        Point of Sales
      </q-toolbar-title>
      {{ today() }}

      <SaleSummaryBtn />

      <closing-button @salesClosed="salesClosed" />
    </q-toolbar>
    <div class="row">
      <div class="col-sm-12 col-md-4 q-pa-sm">
        <add-sales
          class="shadow-3"
          @sales-saved="salesSaved"
          :clientId="clientId"
        />
      </div>
      <div class="col-sm-12 col-md-8 q-pa-sm">
        <q-tabs v-model="tab" class="text-teal">
          <q-tab name="sale-tab" label="Sale" content-class="text-primary" />
          <q-tab
            name="deposit-tab"
            label="Deposit"
            content-class="text-positive"
          />
          <q-tab
            name="cash-in-out-tab"
            label="Cash In Out"
            content-class="text-secondary"
          />
        </q-tabs>
        <q-tab-panels v-model="tab" animated keep-alive>
          <q-tab-panel name="sale-tab">
            <sales-list ref="sales" :deposits="deposits" />
          </q-tab-panel>
          <q-tab-panel name="deposit-tab">
            <deposit-today-list
              @input="depositListHandle"
              ref="depositTodayList"
            />
          </q-tab-panel>
          <q-tab-panel name="cash-in-out-tab">
            <cash-in-out-list
              @input="cashInOutListHandle"
              ref="cashInOutList"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <!-- <div class="row">
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
    </div> -->
  </q-page>
</template>

<script>
import SalesList from "./components/SalesList";
import DepositTodayList from "./components/DepositTodayList";
import CashInOutList from "./components/CashInOutList";
import AddSales from "./components/AddSales";
import SaleSummaryBtn from "./components/SaleSummaryBtn";
import ClosingButton from "src/components/ClosingButton.vue";
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
      deposits: [],
      cashInOuts: [],
      tab: "sale-tab"
    };
  },
  computed: {},
  watch: {},
  methods: {
    salesSaved(model) {
      this.$refs.sales.add(model);
      this.$refs.cashInOutList.fetch();
    },
    depositListHandle(deposits) {
      this.deposits = deposits;
    },
    cashInOutListHandle(model) {
      this.cashInOuts = model;
    },
    salesClosed() {
      this.$refs.sales?.close();
      this.$refs.depositTodayList?.close();
      this.$refs.cashInOutList?.close();
    }
  },
  components: {
    SalesList,
    DepositTodayList,
    CashInOutList,
    AddSales,
    SaleSummaryBtn,
    ClosingButton
  }
};
</script>
