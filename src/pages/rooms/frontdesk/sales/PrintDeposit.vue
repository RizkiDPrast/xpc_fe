<template>
  <q-card :style="receiptPaperStyle" v-if="model && model.id">
    <receipt-header />
    <q-card-section
      class="row no-padding"
      style="padding-left:12px!important;padding-right:12px!important"
    >
      Date:
      {{ $util.formatDate(model.createdAt, "DD MMM YY hh:mm") }}
    </q-card-section>
    <q-card-section
      class="row no-padding"
      style="padding-left:12px!important;padding-right:12px!important"
    >
      {{ model.depositCode }}
      <q-space />
      {{ model.createdByName }}
    </q-card-section>
    <hr />
    <q-card-section class="full-width no-padding">
      <q-list class="no-padding">
        <q-item class="full-width" dense>
          <q-item-section>
            <q-item-label>
              Name
            </q-item-label>
          </q-item-section>
          <q-item-section side class="text-right" style="color:black">
            Credit | Debit
          </q-item-section>
        </q-item>
        <q-item class="full-width" dense>
          <q-item-section>
            <q-item-label v-if="model.clientName && model.clientName.length">
              {{ model.clientName }}
            </q-item-label>
            <q-item-label v-else-if="model.client && model.client.name">
              {{ model.client.code }} - {{ model.client.name }}
            </q-item-label>
          </q-item-section>
          <q-item-section
            side
            top
            style="margin-top:4px;color:black"
            class="text-right"
          >
            {{ model.credit | money({ prefix: "" }) }}
            |
            {{ model.debit | money({ prefix: "" }) }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <hr />
    <q-card-section>
      <q-markup-table flat dense style="overflow:hidden;">
        <tr>
          <th style="width:60%;font-weight: unset;" class="text-right">
            SubTotal
          </th>
          <td style="width:40%" class="text-right">
            {{ (model.credit - model.debit) | money }}
          </td>
        </tr>
      </q-markup-table>
    </q-card-section>
    <q-card-section class="text-center">
      {{ model.note }}
    </q-card-section>
    <hr />
  </q-card>
</template>

<script>
import ReceiptHeader from "./components/ReceiptHeader";
import DepositTransaction from "src/models/DepositTransaction";
export default {
  name: "print-deposit-dialog",
  components: {
    ReceiptHeader
  },
  props: {
    depositTransaction: {
      type: DepositTransaction,
      default: () => undefined
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
      animalTypes: [],
      to: undefined,
      toTime: 3000,
      fetching: false,
      model: this.depositTransaction
    };
  },
  computed: {
    edcTypes() {
      return this.$store.state.list.edcTypes;
    }
  },
  methods: {
    afterPrint() {
      this.$router.back();
    },
    afterPrintFirefox() {
      // hack hack hack
      this.to = setTimeout(() => {
        this.$router.back();
      }, this.toTime);
    },
    print() {
      if (window.matchMedia) {
        var mediaQueryList = window.matchMedia("print");
        mediaQueryList.addListener(function(mql) {
          if (mql.matches) {
            // beforePrint();
          } else {
            if (this.afterPrint) {
              this.afterPrint();
            }
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
        var res = await this.$api.deposits.getOne(this.id);
        this.model = new DepositTransaction(res.data);
        // this.printDepositProtocol(this.model.id);
        window.PRINT_READY = true;
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
*
  font-family: system-ui, sans-serif
</style>
