<template>
  <div class="full-width">
    <ItemUsageBtn
      outlined
      dense
      flat
      no-caps
      rounded
      :clientId="
        model.client && model.client !== null ? model.client.id : undefined
      "
      @item-usages-added="itemUsagesAdded"
    />

    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title class="text-bold">
        Receipt
      </q-toolbar-title>
      <q-space />
      <q-btn
        rounded
        size="sm"
        no-caps
        class="q-mr-sm"
        @click="openClientDialog"
        :loading="loadingClient"
        :disabled="!!clientId"
        :class="clientId ? 'bg-white text-black' : 'bg-white text-primary'"
      >
        <u>C</u>lient
        <span
          v-if="model.client && model.client.id"
          style="max-width:180px;"
          class="ellipsis"
        >
          &nbsp;:&nbsp;{{ clientButtonLabel }}
        </span>
        <q-tooltip content-class="bg-purple text-white" v-if="!clientId">
          Select client (shortcut: Alt + c)
        </q-tooltip>
      </q-btn>

      <q-btn
        v-show="hasItem"
        rounded
        color="white"
        text-color="negative"
        class="q-mr-sm"
        size="sm"
        @click="clearItems"
      >
        <u>X</u> &nbsp;&nbsp;&nbsp;&nbsp; Clear
        <q-tooltip content-class="bg-purple text-white">
          Clear all items (shortcut: Alt + x)
        </q-tooltip>
      </q-btn>

      <q-btn
        rounded
        dense
        icon="las la-plus"
        class=" q-px-sm"
        color="white"
        text-color="primary"
        size="sm"
        no-caps
        @click="searchDialogOpen = true"
      >
        <u>A</u>DD
        <q-tooltip content-class="bg-purple text-white">
          Add an item (shortcut: Alt + a)
        </q-tooltip>
      </q-btn>
    </q-toolbar>
    <div class="col flex-center">
      <q-card class="bg-primary text-white " style="opacity:.8">
        <!-- <div
          style="position:absolute;left:0px;background-color:white;border-radius:6px"
        >
          <q-btn
            color="positive"
            no-caps
            flat
            @click="receiptCodePopup = true"
            :label="model.receiptCode || '[auto-receipt]'"
          >
          </q-btn>
        </div> -->
        <!-- <div style="position:absolute;left:0px;bottom:0;z-index:100">
          <q-checkbox
            color="positive"
            v-model="model.isTracked"
            :label="model.isTracked ? 'tracked' : 'Track receipt?'"
          />
        </div> -->

        <q-popup-edit v-model="receiptCodePopup" title="Update receipt code">
          <q-input clearable v-model="model.receiptCode" dense autofocus />
        </q-popup-edit>
        <q-card-section class="text-center" style="font-size:2em">
          {{ grossTotal | money }}
        </q-card-section>
      </q-card>
      <sales-line-list
        v-model="model.saleLines"
        :clientId="model.clientId"
        style="margin-bottom: 15px;height:500px;overflow-y: auto;"
      />
      <div
        v-show="hasItem"
        class="full-width q-px-sm"
        style="position:relative;bottom:0;left:0"
      >
        <q-btn-group class="full-width no-shadow">
          <q-btn
            label="Payment"
            class="full-width"
            color="primary"
            @click="openPaymentDialog"
          />
        </q-btn-group>
      </div>
    </div>
    <payment-dialog
      v-model="paymentDialogOpen"
      :sales="model"
      @sales-saved="salesSaved"
    />
    <search-item-dialog
      v-model="searchDialogOpen"
      :search="search"
      @item-picked="itemPicked"
    />
    <add-client-in-receipt-dialog
      v-model="addClientDialog"
      :client="model.client"
      @update:client="clientUpdated"
    />
  </div>
</template>

<script>
import Sale from "src/models/Sale";
import SaleLine from "src/models/SaleLine";
import Client from "src/models/Client";

import SalesLineList from "./SalesLineList";
import PaymentDialog from "./PaymentDialog";
import SearchItemDialog from "./SearchItemDialog";
import AddClientInReceiptDialog from "./AddClientInReceiptDialog";

import ItemUsageBtn from "./ItemUsageBtn";
export default {
  name: "AddSales",
  props: {
    value: {
      type: Sale,
      default: () => new Sale()
    },
    clientId: {
      type: [String, Number],
      default: () => 0
    }
  },
  data() {
    return {
      model: this.value,
      paymentDialogOpen: false,
      searchDialogOpen: false,
      addClientDialog: false,
      search: "",
      receiptCodePopup: false,
      loadingClient: false,
      loadingUnpaid: false
    };
  },
  components: {
    SalesLineList,
    PaymentDialog,
    SearchItemDialog,
    AddClientInReceiptDialog,
    ItemUsageBtn
  },
  watch: {
    value(val) {
      if (Array.isArray(val.saleLines)) {
        val.saleLines = val.saleLines.map(x => new SaleLine(x));
      }
    },
    clientId(val) {
      this.fetchClient();
    }
  },
  mounted() {
    this.initListeners();
    this.fetchClient();
  },
  destroyed() {
    this.removeListeners();
  },
  methods: {
    openClientDialog() {
      if (this.clientId) {
        return;
      }
      this.addClientDialog = true;
    },
    keydown(e) {
      if (e.altKey) {
        if (e.key === "a") {
          this.searchDialogOpen = true;
        }
        if (e.key === "c") {
          this.openClientDialog();
        }

        if (e.key === "x") {
          this.clearItems();
        }

        if (e.key === "p") {
          this.openPaymentDialog();
        }
      }
    },
    initListeners() {
      document.addEventListener("keyup", this.keydown);
    },
    removeListeners() {
      document.removeEventListener("keyup", this.keydown);
    },
    async fetchClient() {
      if (!this.clientId) return;
      if (this.loadingClient) return;
      this.loadingClient = true;
      try {
        let res = await this.$api.clients.getOne(this.clientId);
        this.clientUpdated(res.data);
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loadingClient = false;
    },
    async fetchUnpaids(clientId) {
      if (this.loadingUnpaid) return;
      this.loadingUnpaid = true;
      try {
        let res = await this.$api.sales.getClientUnpaids(clientId);
        if (res.data && res.data.length) {
          for (let i = 0; i < res.data.length; i++) {
            const debt = res.data[i];
            var sl = new SaleLine({
              itemName: `[${debt.receiptCode}] Pelunasan`,
              qty: 1,
              unitId: 1,
              moneyDiscount: 0,
              percentDiscount: 0,
              unitPrice: debt.total,
              debtSaleId: debt.id
            });
            this.model.saleLines.push(sl);
          }
        }
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loadingUnpaid = false;
    },
    clientUpdated(client) {
      if (client && client !== null) {
        // console.log('client', client.id, client, this.model.clientId)
        // this.model = Object.assign({}, this.model, { client: new Client(client) })
        this.model.client = new Client(client);
        this.model.clientId = client.id;
      } else {
        this.model.client = undefined;
        this.model.clientId = undefined;
      }

      this.clearItems();

      //check unpaid items
      if (this.model.clientId) {
        this.fetchUnpaids(this.model.clientId);
      }

      // console.log('client', client.id, client, this.model.clientId)
    },
    openPaymentDialog() {
      this.$set(this.model, "subTotal", this.grossTotal);
      // this.$set(this.model, 'totalItem', this.totalItem)
      this.model.saleLines = this.model.saleLines.map(x => new SaleLine(x));
      this.paymentDialogOpen = true;
    },
    itemPicked(val) {
      if (val.product && val.maxUnit) {
        var subUnits = val.product.productUnits || [];
        var currentUsed = this.model.saleLines.reduce((a, b) => {
          if (b.productId !== val.productId) return a;
          var qty = b.qty;
          //convert to baseUnit
          if (subUnits.length && b.unitId !== val.unitId) {
            var su = subUnits.find(x => x.unitId === b.unitId);
            if (!su) {
              this.$toastr.error(
                "Invalid subunits. Please try to reload page."
              );
              return;
            }
            qty *= su.toBaseMultiplier;
          }
          return a + qty;
        }, 0);
        val.maxUnit -= currentUsed;
        val.product.qty = val.maxUnit;
        if (val.maxUnit < 1) {
          this.$toastr.error(`The product ${val.itemName} is out of stock`);
          return;
        }
      }

      this.model.saleLines.push(new SaleLine(val));
      // this.$util.log("itemPicked", val, this.model.saleLines);
    },
    itemUsagesAdded(model) {
      // console.log("itemUsagesAdded", model);

      //s1 clear all items that already has itemUsages
      this.model.saleLines = this.model.saleLines.filter(
        x => !x.itemUsages || !x.itemUsages.length
      );
      for (let val of model) {
        this.model.saleLines.push(new SaleLine(val));
      }
      // console.log("saleLines", this.model.saleLines);
    },
    clearItems() {
      this.model.saleLines = [];
    },
    clearAll() {
      this.model = new Sale();
    },
    salesSaved(model) {
      this.$toastr.success("Sales was saved");
      this.$emit("sales-saved", model);
      this.clearAll();
    }
  },
  computed: {
    grossTotal() {
      return this.model.saleLines.reduce((a, b, i, arr) => {
        return a + b.rowTotal;
      }, 0);
    },
    totalItem() {
      return this.model.saleLines.reduce((a, b, i, arr) => {
        return a + b.qty;
      }, 0);
    },
    edcTypes() {
      return this.$store.state.list.edcTypes;
    },
    hasItem() {
      return this.model.saleLines.length > 0;
    },
    clientButtonLabel() {
      let m = this.model.client;
      if (!m || m === null || !m.id) {
        return "Buyer";
      }
      return this.model.client.code + " - " + this.model.client.name;
    }
  }
};
</script>
