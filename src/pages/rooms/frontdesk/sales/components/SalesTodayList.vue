<template>
  <div>
    <q-card-section title class="text-h5 q-pb-xs">
      Sales today
      <span class="text-bold"> {{ totalSales | money }}</span>
      <div class="text-italic">
        <small> Revenue: {{ totalRevenue | money }} </small>
        <!-- {{this.totalCash}}
        {{this.totalDeposit}}
        {{this.totalCard}}
        {{this.totalDepositCredit}}
        {{this.totalDepositDebit}} -->
      </div>
    </q-card-section>
    <q-card-section class="q-pt-xs">
      <q-list>
        <q-card v-if="!hasItem">
          <q-card-section>
            No Sale yet
          </q-card-section>
        </q-card>

        <template v-else>
          <q-table
            flat
            title=""
            :data="data"
            :columns="columns"
            row-key="id"
            :loading="isLoading"
          >
            <template #header>
              <tr class="bg-grey-3">
                <td rowspan="2">
                  Actions
                </td>
                <td rowspan="2">
                  #
                </td>
                <td rowspan="2">
                  Receipt
                </td>
                <td rowspan="2">
                  Sales
                </td>
                <td rowspan="2">
                  Cash
                </td>
                <td rowspan="2">
                  Transfer
                </td>
                <td colspan="3" class="text-center">
                  Credit Card
                </td>
                <td colspan="3" class="text-center">
                  Debit Card
                </td>
                <td rowspan="2">
                  Deposit
                </td>
                <td rowspan="2">
                  Revenue
                </td>
              </tr>
              <tr class="bg-grey-3">
                <td v-for="item in edcTypes" :key="item.id">
                  {{ item.label }}
                </td>

                <td v-for="item in edcTypes" :key="item.id">
                  {{ item.label }}
                </td>
              </tr>
            </template>
            <template #body="scoped">
              <q-tr
                class="mouse-pointer"
                :class="{ selected: selectedSales.id === scoped.row.id }"
                @click.native="getSalesDetails(scoped.row.id, scoped.row)"
                :key="scoped.row.id"
              >
                <td>
                  <q-btn
                    :disable="false"
                    icon="las la-print"
                    size="sm"
                    round
                    text-color="primary"
                    title="print"
                    @click.stop="printSales(scoped.row.id, scoped.row)"
                  />
                </td>
                <td>
                  {{ data.indexOf(scoped.row) + 1 }}
                </td>
                <td>
                  {{ scoped.row.receiptCode }}
                  <q-badge
                    v-if="scoped.row.client"
                    :label="scoped.row.client.code"
                    class="q-ml-md"
                  />
                </td>
                <td class="text-right">
                  {{ scoped.row.grandTotal | money }}
                </td>
                <td class="text-right">
                  {{ scoped.row.cash | money }}
                </td>
                <td class="text-right">
                  {{ scoped.row.transfer | money }}
                </td>
                <td class="text-right" v-for="item in edcTypes" :key="item.id">
                  {{
                    (scoped.row.ccEdcType === item.id
                      ? scoped.row.creditCard
                      : 0) | money
                  }}
                </td>
                <td class="text-right" v-for="item in edcTypes" :key="item.id">
                  {{
                    (scoped.row.dcEdcType === item.id
                      ? scoped.row.debitCard
                      : 0) | money
                  }}
                </td>
                <td class="text-right">
                  {{ scoped.row.deposit | money }}
                </td>
                <td
                  class="text-right"
                  :class="{ 'text-negative': scoped.row.totalUnpaid > 0 }"
                >
                  {{ scoped.row.revenue | money }}
                </td>
              </q-tr>
            </template>
            <template #bottom-row>
              <tr class="bg-grey-3  text-bold">
                <td colspan="3" class="text-center">
                  TOTAL
                </td>
                <td class="text-right">
                  {{ totalSales | money }}
                </td>
                <td class="text-right">
                  {{ totalCash | money }}
                </td>
                <td class="text-right">
                  {{ totalTransfer | money }}
                </td>
                <td class="text-right" v-for="item in edcTypes" :key="item.id">
                  {{
                    data.reduce(
                      (a, b) =>
                        a + b.ccEdcType === item.id ? b.creditCard : 0,
                      0
                    ) | money
                  }}
                </td>
                <td class="text-right" v-for="item in edcTypes" :key="item.id">
                  {{
                    data.reduce(
                      (a, b) => (a + b.dcEdcType === item.id ? b.debitCard : 0),
                      0
                    ) | money
                  }}
                </td>

                <td class="text-right">
                  {{ totalDeposit | money }}
                </td>
                <td
                  class="text-right"
                  :class="{ 'text-negative': totalChange < 0 }"
                >
                  {{ totalRevenue | money }}
                </td>
              </tr>
            </template>
          </q-table>
        </template>
      </q-list>
      <sales-details-dialog v-model="detailsDialog" :sales="selectedSales" />
    </q-card-section>
  </div>
</template>

<script>
import Sale from "src/models/Sale";
import SaleLine from "src/models/SaleLine";
import SalesDetailsDialog from "./SalesDetailsDialog";
export default {
  name: "SalesTodayList",
  components: {
    SalesDetailsDialog
  },
  props: {
    deposits: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isLoading: false,
      columns: [
        {
          name: "id",
          required: true,
          format: (val, row) => this.data.indexOf(row) + 1,
          style: "width: 25px",
          label: "#"
        },
        {
          name: "receiptCode",
          align: "left",
          field: "receiptCode",
          label: "Receipt",
          style: "width:50px",
          sortable: true
        },
        {
          name: "grandTotal",
          align: "right",
          field: "grandTotal",
          label: "Sales",
          sortable: true,
          format: (val, row) => val
        },
        {
          name: "netCash",
          align: "right",
          field: "netCash",
          label: "Cash",
          sortable: true
        },
        {
          name: "card",
          align: "right",
          field: "card",
          label: "Card",
          style: "width:25px;font-color:green;"
        },
        {
          name: "deposit",
          align: "right",
          field: "deposit",
          label: "Deposit",
          style: ""
        },
        {
          name: "revenue",
          align: "center",
          field: "revenue",
          label: "revenue",
          style: ""
        }
      ],
      data: [],
      saleLines: {},
      detailsDialog: false,
      selectedSales: new Sale(),
      isLoadingSalesLines: false
    };
  },
  mounted() {
    this.fetchSales();
  },
  methods: {
    close() {
      this.data = [];
    },
    async fetchSales() {
      try {
        this.isLoading = true;
        let res = await this.$api.sales.getToday();
        this.data = res.data.map(x => new Sale(x));
      } catch (e) {
        this.$toastr.error(e.message);
      }
      this.isLoading = false;
    },
    add(sales) {
      var model = new Sale(sales);
      this.data.push(model);
      if (this.$store.state.config.autoPrintSalesOnSave) {
        this.printSales(model.id, model);
      }
    },
    async getSalesDetails(salesId, sales) {
      if (!salesId || salesId === 0) {
        return;
      }
      if (this.isLoadingSalesLines) return;
      this.isLoadingSalesLines = true;
      try {
        var data = this.saleLines[salesId];
        if (data) {
          sales.saleLines = data;
        } else {
          var res = await this.$api.saleLines.getBySales(salesId);
          data = res.data.map(x => new SaleLine(x));
          this.$set(this.saleLines, salesId, data);
          sales.saleLines = data;
        }
        this.selectedSales = sales;
        this.detailsDialog = true;
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
      this.isLoadingSalesLines = false;
    },
    async printSales(salesId, sales) {
      if (!salesId || salesId === 0) {
        return;
      }
      if (this.isLoadingSalesLines) return;
      this.isLoadingSalesLines = true;
      try {
        var data = this.saleLines[salesId];
        if (!data) {
          var res = await this.$api.saleLines.getBySales(salesId);
          data = res.data.map(x => new SaleLine(x));
          this.$set(this.saleLines, salesId, data);
        }

        sales.saleLines = data;
        this.selectedSales = sales;
        // this.printSalesProtocol(this.selectedSales.id);
        this.$router.push({
          name: "printSales",
          // params: { id: this.selectedSales.id }
          params: { sales: this.selectedSales }
        });
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
      this.isLoadingSalesLines = false;
    }
  },
  computed: {
    hasItem() {
      return this.data.length > 0 || this.deposits.length;
    },
    edcTypes() {
      return this.$store.state.list.edcTypes;
    },
    totalSales() {
      if (!this.data.length) return 0;
      return this.data.reduce((a, b) => a + b.grandTotal, 0);
    },
    totalCash() {
      if (!this.data.length) return 0;
      return this.data.reduce((a, b) => a + b.cash, 0);
    },
    totalTransfer() {
      if (!this.data.length) return 0;
      return this.data.reduce((a, b) => a + b.transfer, 0);
    },
    totalCreditCard() {
      if (!this.data.length) return 0;
      return this.data.reduce((a, b) => a + b.creditCard, 0);
    },
    totalDebitCard() {
      if (!this.data.length) return 0;
      return this.data.reduce((a, b) => a + b.debitCard, 0);
    },
    totalCard() {
      return this.totalCreditCard + this.totalDebitCard;
    },
    totalChange() {
      if (!this.data.length) return 0;
      return this.data.reduce((a, b) => a + b.change, 0);
    },
    totalDeposit() {
      if (!this.data.length) return 0;
      return this.data.reduce((a, b) => a + b.deposit, 0);
    },
    totalDepositDebit() {
      if (!this.deposits.length) return 0;
      return this.deposits.reduce((a, b) => a + b.debit, 0);
    },
    totalDepositCredit() {
      if (!this.deposits.length) return 0;
      return this.deposits.reduce((a, b) => a + b.credit, 0);
    },
    totalRevenue() {
      if (!this.data.length) return 0;
      return this.data.reduce((a, b) => a + b.revenue, 0);
    }
  },
  watch: {}
};
</script>
