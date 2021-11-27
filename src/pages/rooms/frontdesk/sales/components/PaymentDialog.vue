<template>
  <q-dialog
    v-model="model"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="max-height:100vh row;flex-direction:column; display:flex">
      <q-toolbar class="bg-primary text-white">
        <!-- <q-btn flat icon="arrow_right_alt" class="rotate-180"  @click="$router.go(-1)"/> -->
        <q-item-label>
          Total
        </q-item-label>
        <q-toolbar-title class="text-center">
          {{
            (salesModel.grandTotal - (salesModel.cardSurcharge || 0)) | money
          }}
        </q-toolbar-title>
        <q-btn
          flat
          icon="las la-times"
          :disable="isLoading"
          @click="model = false"
        />
      </q-toolbar>
      <q-card-section
        v-if="salesModel.client && salesModel.client.clientId !== 0"
        class="no-margin q-my-xs q-py-xs"
      >
        {{ sales.client.code }} -
        {{ salesModel.client.name }}
        <span class="text-italic" v-if="totalClientDeposit > 0">
          ( Remaining deposit: {{ totalClientDeposit | money }})
        </span>
      </q-card-section>
      <q-card-section class="text-center q-mt-xs q-pt-xs">
        <span style="font-size:3em" class="text-primary">
          {{
            (totalPayment + (salesModel.cardSurcharge || 0)) | money(0)
          }}</span
        >
        <q-card-section
          v-if="totalPayment > salesModel.grandTotal"
          class="text-negative no-margin q-my-xs q-py-xs"
        >
          (change: {{ (totalPayment - salesModel.grandTotal) | money }} )
        </q-card-section>
        <div class="text-grey">
          <span :class="{ 'text-primary': paymentType === 'cash' }">
            cash <span class="money-large"> {{ payment.cash | money }}</span>
          </span>
          <span :class="{ 'text-primary': paymentType === 'transfer' }">
            transfer
            <span class="money-large"> {{ payment.transfer | money }}</span>
          </span>
          <br />
          <span
            v-if="ccSurcharge > 0"
            :class="{ 'text-primary': paymentType === 'creditCard' }"
          >
            ( CC {{ payment.creditCard | money }} +
            <q-tooltip> Credit card surcharge {{ ccTax * 100 }}% </q-tooltip>
            {{ ccSurcharge }}
            =
            <span class="money-large">{{
              (payment.creditCard + ccSurcharge) | money
            }}</span>
            )
          </span>
          <span
            v-else
            :class="{ 'text-primary': paymentType === 'creditCard' }"
          >
            CC
            <span class="money-large">{{ payment.creditCard | money }}</span>
          </span>
          <br />
          <span
            v-if="dcSurcharge > 0"
            :class="{ 'text-primary': paymentType === 'debitCard' }"
          >
            ( DC {{ payment.debitCard | money }} +
            <q-tooltip>
              Debit card surcharge + {{ dcNonBcaMandiri | money }} for non BCA
              and MANDIRI
            </q-tooltip>
            {{ dcSurcharge }}
            =
            <span class="money-large">{{
              (payment.debitCard + dcSurcharge) | money
            }}</span>
            )
          </span>
          <span v-else :class="{ 'text-primary': paymentType === 'debitCard' }">
            DC
            <span class="money-large">{{ payment.debitCard | money }}</span>
          </span>
          <br />
          <span :class="{ 'text-primary': paymentType === 'deposit' }">
            deposit
            <span class="money-large">{{ payment.deposit | money }}</span>
          </span>
          <br />
          <q-badge
            v-if="salesModel.receiptCode"
            style="position:absolute;right:12px;top:12px"
          >
            receipt: {{ salesModel.receiptCode }}
          </q-badge>
          <q-badge
            v-if="salesModel.isTracked"
            color="negative"
            style="position:absolute;right:12px;bottom:12px"
          >
            Tracked
          </q-badge>
        </div>
      </q-card-section>
      <q-card-section class="bg-grey-3 q-gutter-xs text-grey q-py-xs">
        <q-btn-toggle
          :options="[
            { label: 'Cash', value: 'cash' },
            { label: 'Transfer', value: 'transfer' },
            { label: 'CCard', value: 'creditCard' },
            { label: 'DCard', value: 'debitCard' },
            {
              label: 'Deposit',
              value: 'deposit',
              disable: this.totalClientDeposit < 1
            }
          ]"
          class="shadow-1 bg-white text-black"
          size="md"
          v-model="paymentType"
          toggle-text-color="white"
        />
        <q-btn
          :disable="isLoading"
          no-caps
          size="md"
          :label="discountLabel"
          class="bg-white text-black"
        >
          <q-popup-edit v-model="discPopup">
            <money-field
              label="Discount Rp"
              stack-label
              v-model="salesModel.moneyDiscount"
              autofocus
            />
            <q-input
              label="Discount %"
              class="percent-field"
              min="0"
              v-model="salesModel.percentDiscount"
            >
              <template #append>
                %
              </template>
            </q-input>
          </q-popup-edit>
        </q-btn>
        <q-btn
          :disable="isLoading"
          no-caps
          size="md"
          :label="'Tax: ' + salesModel.tax + '%'"
          class="bg-white text-black"
        >
          <q-popup-edit v-model="taxPopup">
            <q-input
              label="Tax"
              stack-label
              v-model="salesModel.tax"
              min="0"
              autofocus
              class="tax-field"
            >
              <template #append>
                %
              </template>
            </q-input>
          </q-popup-edit>
        </q-btn>
        <q-btn
          no-caps
          disable
          v-if="salesModel.cardSurcharge > 0"
          color="white"
          text-color="black"
        >
          + Card Surcharge: {{ salesModel.cardSurcharge | money }}
        </q-btn>
        <!-- <q-btn
          :disable="isLoading"
          size="md"
          no-caps
          label="Buyer"
          class="bg-white text-primary"
          @click="addClientDialog = true"
        /> -->
        <edc-type-select
          dense
          v-model="salesModel.ccEdcType"
          v-if="payment.creditCard > 0"
          label="CC Edc"
          name="ccEdcType"
          v-validate="'required'"
          :error="errors.has('ccEdcType')"
          :error-message="errors.first('ccEdcType')"
          stack-label
          outlined
          style="margin-bottom:-21px;"
        />

        <edc-type-select
          dense
          v-model="salesModel.dcEdcType"
          v-if="payment.debitCard > 0"
          label="DC Edc"
          name="dcEdcType"
          v-validate="'required'"
          :error="errors.has('dcEdcType')"
          :error-message="errors.first('dcEdcType')"
          stack-label
          outlined
          style="margin-bottom:-21px;"
        />

        <q-input
          :disable="isLoading"
          label="Notes"
          v-model="salesModel.Note"
          clearable
          stack-label
          outlined
        />
      </q-card-section>

      <q-card-section class="" style="flex-grow:1">
        <money-keypad
          v-model="tempValue"
          :disable="isLoading"
          :requiredMoney="sales.grandTotal"
          @ok="saveRecord"
        />
      </q-card-section>
    </q-card>

    <add-client-in-receipt-dialog
      v-model="addClientDialog"
      :client.sync="salesModel.client"
    />
  </q-dialog>
</template>

<script>
import Sale from "src/models/Sale";
import MoneyKeypad from "./MoneyKeypad";
import AddClientInReceiptDialog from "./AddClientInReceiptDialog";

export default {
  name: "payment-dialog",
  components: {
    MoneyKeypad,
    AddClientInReceiptDialog
  },
  props: {
    value: {
      type: Boolean,
      default: () => false
    },
    sales: {
      type: Object,
      default: () => new Sale()
    }
  },
  data() {
    return {
      payment: {
        cash: 0,
        transfer: 0,
        creditCard: 0,
        debitCard: 0,
        deposit: 0
      },
      paymentType: "cash",
      taxPopup: false,
      discPopup: false,
      tempValue: 0,
      addClientDialog: false,
      isLoading: false,
      totalClientDeposit: 0,
      ccTax: 3 / 100,
      dcNonBcaMandiri: 6500,
      ccSurcharge: 0,
      dcSurcharge: 0
    };
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    salesModel: {
      get() {
        return this.sales;
      },
      set(val) {
        this.$emit("update:sales", val);
      }
    },
    totalPayment() {
      return (
        this.payment.cash +
        this.payment.transfer +
        this.payment.creditCard +
        this.payment.debitCard +
        this.payment.deposit
      );
    },
    discountLabel() {
      let arr = ["Discount: "];
      if (
        this.salesModel.percentDiscount > 0 ||
        this.salesModel.moneyDiscount === 0
      ) {
        arr.push(this.salesModel.percentDiscount + "%");
      }
      if (arr.length > 1 && this.salesModel.moneyDiscount > 0) {
        arr.push("+");
      }
      if (this.salesModel.moneyDiscount > 0) {
        arr.push(" Rp " + this.salesModel.moneyDiscount);
      }

      return arr.join("");
    }
  },
  watch: {
    tempValue(nval) {
      if (this.paymentType === "cash") {
        this.payment.cash = nval;
      } else if (this.paymentType === "transfer") {
        this.payment.transfer = nval;
      } else if (this.paymentType === "creditCard") {
        this.payment.creditCard = nval;
      } else if (this.paymentType === "debitCard") {
        this.payment.debitCard = nval;
      } else {
        this.payment.deposit = nval;
      }
    },
    "payment.creditCard"(nval) {
      if (nval < 1) {
        this.salesModel.ccEdcType = undefined;
        this.ccSurcharge = 0;
      } else {
        this.ccSurcharge = Number(nval) * this.ccTax;
      }
    },
    "payment.debitCard"(nval) {
      if (nval < 1) {
        this.salesModel.dcEdcType = undefined;
      } else {
        var etype = this.salesModel.dcEdcType;
        // bca:1 mandiri:2 bni:3
        if (etype > 2) {
          this.dcSurcharge = this.dcNonBcaMandiri;
        } else {
          this.dcSurcharge = 0;
        }
      }
    },
    ccSurcharge(val) {
      this.salesModel.cardSurcharge = Number(val) + Number(this.dcSurcharge);
    },
    dcSurcharge(val) {
      this.salesModel.cardSurcharge = Number(val) + Number(this.ccSurcharge);
    },
    "salesModel.dcEdcType"(val) {
      if (val > 2) {
        this.dcSurcharge = this.dcNonBcaMandiri;
      } else {
        this.dcSurcharge = 0;
      }
    },
    "salesModel.client"(nval) {
      if (!nval || nval === null) return;
      this.salesModel.clientId = nval.id;
      this.getClientDeposit(nval.id);
    },
    paymentType(nval) {
      if (nval === "cash") {
        this.tempValue = this.payment.cash;
      } else if (nval === "transfer") {
        this.tempValue = this.payment.transfer;
      } else if (nval === "creditCard") {
        this.tempValue = this.payment.creditCard;
      } else if (nval === "debitCard") {
        this.tempValue = this.payment.debitCard;
      } else {
        this.tempValue = this.payment.deposit;
      }
    }
  },
  methods: {
    async saveRecord() {
      try {
        if (this.payment.creditCard > 0 && !this.salesModel.ccEdcType) {
          this.$toastr.error("Payment by card must select EDC type");
          return;
        }

        if (this.payment.debitCard > 0 && !this.salesModel.dcEdcType) {
          this.$toastr.error("Payment by card must select EDC type");
          return;
        }

        if (this.totalPayment < this.sales.total) {
          if (!this.salesModel.clientId || this.salesModel.clientId === 0) {
            this.$toastr.error(
              "Insufficient payment. Please add client for this bill"
            );
            return;
          } else {
            if (!confirm("Insufficient payment. Continue saving this bill?")) {
              return;
            }
          }
        }

        if (this.payment.deposit > this.totalClientDeposit) {
          this.$toastr.error(
            `Maximum deposit can be used for this client: ${this.$options.filters.money(
              this.totalClientDeposit
            )}`
          );
          return;
        }

        this.salesModel.cardSurcharge =
          Number(this.ccSurcharge) + Number(this.dcSurcharge);

        this.salesModel.moneyDiscount = Number(
          this.salesModel.moneyDiscount || 0
        );
        this.salesModel.percentDiscount = Number(
          this.salesModel.percentDiscount || 0
        );
        this.salesModel.tax = Number(this.salesModel.tax || 0);

        if (this.isLoading) return;
        this.isLoading = true;

        // console.log('sales', this.sales)
        let postModel = Object.assign({}, this.sales, this.payment);
        if (this.ccSurcharge > 0) {
          postModel.creditCard =
            postModel.creditCard + Number(this.ccSurcharge);
        }
        if (this.dcSurcharge > 0) {
          postModel.debitCard = postModel.debitCard + Number(this.dcSurcharge);
        }

        if (postModel.client) {
          postModel.client = undefined;
        }
        if (postModel.clientId < 1) {
          postModel.clientId = undefined;
        }
        // console.log("postModel", postModel);
        var res = await this.$api.sales.post(postModel);
        if (res.status < 300) {
          this.$emit("sales-saved", new Sale(res.data));
          this.model = false;
          this.tempValue = 0;
        } else {
          this.$$toastr.error(this.$util.err(res));
          if (this.ccSurcharge > 0) {
            postModel.creditCard =
              postModel.creditCard - Number(this.ccSurcharge);
          }
          if (this.dcSurcharge > 0) {
            postModel.debitCard =
              postModel.debitCard - Number(this.dcSurcharge);
          }
        }
      } catch (e) {
        // console.log('err', e);
        this.$toastr.error(e);
      }
      this.isLoading = false;
    },
    async getClientDeposit(id) {
      if (!id || id === 0) {
        return;
      }
      try {
        var res = await this.$api.deposits.getTotalByClient(id);
        this.totalClientDeposit = res.data;
        if (this.totalClientDeposit > 0) {
          this.$toastr.warning("Client still have a deposit");
        }
        this.payment.deposits = this.totalClientDeposit;
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.money-large
  font-size : 1em

.tax-field .q-field__native, .percent-field .q-field__native
  text-align: center!important
</style>
