<template>
  <q-card
    :style="receiptPaperStyle"
    v-if="model && model.id && model.saleLines && model.saleLines.length"
  >
    <receipt-header />
    <q-card-section
      class="row no-padding"
      style="padding-left:12px!important;padding-right:12px!important"
    >
      Date: {{ $util.formatDate(model.createdAt, "DD MMM YY hh:mm") }}
    </q-card-section>
    <q-card-section
      class="row no-padding"
      style="padding-left:12px!important;padding-right:12px!important"
    >
      {{ model.receiptCode }}
      <q-space />
      {{ model.createdByName }}
    </q-card-section>
    <hr />
    <q-card-section class="full-width no-padding">
      <q-list class="no-padding">
        <span v-for="i in 1" :key="i">
          <q-item
            v-for="item in groupedSalesItems"
            :key="item.id"
            class="full-width"
          >
            <q-item-section>
              <q-item-label>
                {{ item.itemName.replace("[null]", "") }}
              </q-item-label>
              <q-item-label caption :style="subtitleStyle">
                {{ item.qty }} *
                {{ item.unitPrice | money({ style: undefined }) }}
                /
                <template v-if="item.unitName">
                  {{ item.unitName }}
                </template>
                <template v-else>
                  {{ getUnitName(item.unitId) }}
                </template>
                <template v-if="item.hasDiscount">
                  <span v-if="item.percentDiscount" class="text-bold">
                    - {{ item.percentDiscount }}%</span
                  >
                  <span v-if="item.moneyDiscount" class="text-bold">
                    - {{ item.moneyDiscount | money({ style: undefined }) }}
                  </span>
                </template>
              </q-item-label>
            </q-item-section>
            <q-item-section side class="text-right" style="color:black">
              {{ item.rowTotal | money({ style: undefined }) }}
            </q-item-section>
          </q-item>
        </span>
      </q-list>
    </q-card-section>
    <hr />
    <div class="q-ml-md" v-if="model.client">
      Member:<br />
      {{ model.client.code }} -
      {{ model.client.name }}
    </div>
    <q-card-section>
      <q-markup-table flat dense style="overflow:hidden;">
        <tr>
          <th style="width:60%;font-weight: unset;" class="text-right">
            SubTotal
          </th>
          <td style="width:40%" class="text-right">
            {{ model.subTotal | money }}
          </td>
        </tr>
        <tr v-if="model.discountPercent > 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            % Discount {{ model.discountPercent }} %
          </th>
          <td style="width:40%" class="text-right">
            {{ model.discountPercentMoneyValue | money }}
          </td>
        </tr>
        <tr v-if="model.discount > 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            Discount
          </th>
          <td style="width:40%" class="text-right">
            {{ model.moneyDiscount | money }}
          </td>
        </tr>
        <tr v-if="model.tax > 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            Tax {{ model.tax }} %
          </th>
          <td style="width:40%" class="text-right">
            {{ model.taxMoneyValue | money }}
          </td>
        </tr>
        <tr v-if="model.cardSurcharge > 0">
          <th style="width:60%;font-weight: unset" class="text-righttext-bold">
            Card surcharge
          </th>
          <td style="width:40%" class="text-right">
            {{ model.cardSurcharge | money }}
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
            {{ model.grandTotal | money }}
          </td>
        </tr>
        <tr v-if="model.cash > 0">
          <th style="width:60%;font-weight: unset" class="text-right">Cash</th>
          <td style="width:40%" class="text-right">
            {{ model.cash | money }}
          </td>
        </tr>
        <tr v-if="model.transfer > 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            Transfer
          </th>
          <td style="width:40%" class="text-right">
            {{ model.transfer | money }}
          </td>
        </tr>
        <tr v-if="model.creditCard > 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            CC
            <span class="text-bold" v-if="model.ccEdcType !== 0">
              {{ getEdcTypeName(model.ccEdcType) }}
            </span>
          </th>
          <td style="width:40%" class="text-right">
            {{ model.creditCard | money }}
          </td>
        </tr>
        <tr v-if="model.debitCard > 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            DC
            <span class="text-bold" v-if="model.dcEdcType !== 0">
              {{ getEdcTypeName(model.dcEdcType) }}
            </span>
          </th>
          <td style="width:40%" class="text-right">
            {{ model.debitCard | money }}
          </td>
        </tr>
        <tr v-if="model.deposit > 0">
          <th style="width:60%;font-weight: unset" class="text-right">
            Deposit
          </th>
          <td style="width:40%" class="text-right">
            {{ model.deposit | money }}
          </td>
        </tr>
        <tr v-if="model.cash === 0 && model.card === 0 && model.deposit === 0">
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
            {{ model.change | money }}
          </td>
        </tr>
      </q-markup-table>
    </q-card-section>
    <q-card-section class="text-center">
      {{ model.note }}
      <!-- 1234567890///---
      <br />
      abcdefghijklmnopqrstuvwxyz
      {{ "abcdefghijklmnopqrstuvwxyz".toUpperCase() }} -->
    </q-card-section>
    <q-card-section class="text-center" v-html="footNotes"> </q-card-section>
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
      default: () => new Sale()
    },
    id: {
      type: String,
      default: () => undefined
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
      footNotes:
        "--Terima kasih--<br>" +
        "<p class='text-left q-mt-md text-caption'>Transfer ke<br>" +
        "BCA: 166 3157 063<br>" +
        "MANDIRI: 1570 0045 75081<br>" +
        "a.n Fochi Stelladayef</p>",
      animalTypes: [],
      to: undefined,
      toTime: 3000,
      fetching: false,
      model: this.sales
    };
  },
  computed: {
    edcTypes() {
      return this.$store.state.list.edcTypes;
    },
    groupedSalesItems() {
      if (!this.model.saleLines || !this.model.saleLines.length) {
        return [];
      }
      var arr = this.model.saleLines.reduce((a, b) => {
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
    },
    print() {
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
    async fetch() {
      if (this.fetching) return;
      this.fetching = true;
      try {
        var res = await this.$api.sales.getOne(this.id);
        this.model = new Sale(res.data);
        window.PRINT_READY = true;
        // this.printSalesProtocol(this.model.id);
      } catch (error) {
        alert(error);
      }
      this.fetching = false;
    }
  },
  mounted() {
    if (this.id) {
      this.fetch();
    } else {
      this.print();
    }
  },
  beforeMount() {
    if (this.to) {
      clearTimeout(this.to);
    }
  }
};
// 'Roboto', monospace
</script>

<style lang="sass" scoped>
hr
  border: none!important
  border-top: 1px dashed!important
  height: 1px!important
  width:  90%
table th
  font-size:  12px
table td
  padding-right: 0!important

*
  font-family: system-ui, sans-serif
</style>
