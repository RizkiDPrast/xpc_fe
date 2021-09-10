<template>
  <q-card
    :style="receiptPaperStyle"
    v-if="sales && sales.id && sales.saleLines && sales.saleLines.length"
  >
    <receipt-header />
    <q-card-section
      class="row no-padding"
      style="padding-left:12px!important;padding-right:12px!important"
    >
      Date: {{ $util.formatDate(sales.createdAt, "DD MMM YY hh:mm") }}
    </q-card-section>
    <q-card-section
      class="row no-padding"
      style="padding-left:12px!important;padding-right:12px!important"
    >
      {{ sales.receiptCode }}
      <q-space />
      {{ sales.createdByName }}
    </q-card-section>
    <hr />
    <q-card-section class="full-width no-padding">
      <q-list class="no-padding">
        <q-item
          v-for="item in groupedSalesItems"
          :key="item.id"
          class="full-width"
        >
          <q-item-section>
            <q-item-label>
              {{ item.itemName }}
            </q-item-label>
            <q-item-label caption :style="subtitleStyle">
              {{ item.qty }} *
              {{ item.unitPrice | money({ style: undefined }) }}
              / {{ getUnitName(item.unitId) }}
              <template v-if="item.hasDiscount">
                <span v-if="item.percentDiscount" class="text-red">
                  - {{ item.percentDiscount }}%</span
                >
                <span v-if="item.moneyDiscount" class="text-red">
                  - {{ item.moneyDiscount | money({ style: undefined }) }}
                </span>
              </template>
            </q-item-label>
          </q-item-section>
          <q-item-section side class="text-right">
            {{ item.rowTotal | money({ style: undefined }) }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <hr />
    <div class="q-ml-md" v-if="sales.client">
      Member:<br />
      {{ sales.client.code }} -
      {{ sales.client.name }}
    </div>
    <q-card-section>
      <q-markup-table flat dense style="overflow:hidden;">
        <tr>
          <th style="width:60%;font-weight: unset;" class="text-right">
            SubTotal
          </th>
          <td style="width:40%" class="text-right">
            {{ sales.subTotal | money }}
          </td>
        </tr>
        <tr v-if="sales.discountPercent > 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            % Discount {{ sales.discountPercent }} %
          </th>
          <td style="width:40%" class="text-right">
            {{ sales.discountPercentMoneyValue | money }}
          </td>
        </tr>
        <tr v-if="sales.discount > 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            Discount
          </th>
          <td style="width:40%" class="text-right">
            {{ sales.moneyDiscount | money }}
          </td>
        </tr>
        <tr v-if="sales.tax > 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            Tax {{ sales.tax }} %
          </th>
          <td style="width:40%" class="text-right">
            {{ sales.taxMoneyValue | money }}
          </td>
        </tr>
        <tr v-if="sales.cardSurcharge > 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            Card surcharge
          </th>
          <td style="width:40%" class="text-right">
            {{ sales.cardSurcharge | money }}
          </td>
        </tr>
        <tr class="">
          <th style="width:60%;font-weight: unset" class="text-right text-bold">
            TOTAL
          </th>
          <td
            style="width:40%;font-weight: bold;border-top:.5px solid"
            class="text-right text-bold"
          >
            {{ sales.grandTotal | money }}
          </td>
        </tr>
        <tr v-if="sales.cash > 0">
          <th style="width:60%;font-weight: unset" class="text-right">Cash</th>
          <td style="width:40%" class="text-right">
            {{ sales.cash | money }}
          </td>
        </tr>
        <tr v-if="sales.transfer > 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            Transfer
          </th>
          <td style="width:40%" class="text-right">
            {{ sales.transfer | money }}
          </td>
        </tr>
        <tr v-if="sales.creditCard > 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            CC
            <span class="text-bold" v-if="sales.ccEdcType !== 0">
              {{ getEdcTypeName(sales.ccEdcType) }}
            </span>
          </th>
          <td style="width:40%" class="text-right">
            {{ sales.creditCard | money }}
          </td>
        </tr>
        <tr v-if="sales.debitCard > 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            DC
            <span class="text-bold" v-if="sales.dcEdcType !== 0">
              {{ getEdcTypeName(sales.dcEdcType) }}
            </span>
          </th>
          <td style="width:40%" class="text-right">
            {{ sales.debitCard | money }}
          </td>
        </tr>
        <tr v-if="sales.deposit > 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            Deposit
          </th>
          <td style="width:40%" class="text-right">
            {{ sales.deposit | money }}
          </td>
        </tr>
        <tr v-if="sales.cash === 0 && sales.card === 0 && sales.deposit === 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            Payment
          </th>
          <td style="width:40%" class="text-right text-bold">
            {{ 0 | money }}
          </td>
        </tr>
        <tr>
          <th style="width:60%;font-weight: unset;" class="text-right">
            Change
          </th>
          <td style="width:40%;" class="text-right">
            {{ sales.change | money }}
          </td>
        </tr>
      </q-markup-table>
    </q-card-section>
    <q-card-section class="text-center">
      {{ sales.note }}
    </q-card-section>
    <q-card-section
      class="text-italic text-center"
      style="font-size:11px"
      v-html="footNotes"
    >
    </q-card-section>
    <hr />
  </q-card>
</template>

<script>
import ReceiptHeader from "./components/ReceiptHeader";
import Sale from "src/models/Sale";
export default {
  name: "print-sales-dialog",
  components: {
    ReceiptHeader
  },
  props: {
    sales: {
      type: Sale,
      required: true
    }
  },
  data() {
    return {
      receiptPaperStyle: {
        width: "7.5cm",
        fontSize: "13px!important"
        // fontFamily: 'sans-serif!important'
      },
      subtitleStyle: {
        fontSize: "12px!important",
        color: "black"
      },
      footNotes: "--Terima kasih--",
      animalTypes: [],
      to: undefined,
      toTime: 3000
    };
  },
  computed: {
    edcTypes() {
      return this.$store.state.list.edcTypes;
    },
    groupedSalesItems() {
      if (!this.sales.saleLines || !this.sales.saleLines.length) {
        return [];
      }
      var arr = this.sales.saleLines.reduce((a, b) => {
        if (!b.productId || b.productId === 0) {
          a.push(b);
        } else {
          var m = a.find(x => x.productId === b.productId);
          if (!m) {
            a.push(b);
          } else {
            m.qty += b.qty;
          }
        }
        return a;
      }, []);
      return arr;
    }
  },
  methods: {
    getEdcTypeName(id) {
      var t = this.edcTypes.find(x => x.id === id);
      if (!t) return "";

      return t.label;
    },
    afterPrint() {
      this.$router.back();
    },
    afterPrintFirefox() {
      // hack hack hack
      this.to = setTimeout(() => {
        this.$router.back();
      }, this.toTime + this.groupedSalesItems.length * 200);
    }
  },
  mounted() {
    if (window.matchMedia) {
      var mediaQueryList = window.matchMedia("print");
      mediaQueryList.addListener(function(mql) {
        if (mql.matches) {
          // beforePrint();
        } else {
          this.afterPrint();
        }
      });
    }

    window.onafterprint = this.afterPrintFirefox;
    setTimeout(() => {
      window.print();
    }, 200);
  },
  beforeMount() {
    if (this.to) {
      clearTimeout(this.to);
    }
  }
};
</script>

<style lang="sass" scoped>
hr
  border: none!important
  border-top: 1px dashed!important
  height: 1px!important
  width:  90%
table th
  font-size:  10px
table td
  padding-right: 0!important
</style>
