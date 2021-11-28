<template>
  <div>
    <q-toolbar v-if="!all">
      <q-toolbar-title>
        <span>Sales today</span>
        <span class="text-bold"> {{ totalSales | money }}</span>
        <div class="text-italic">
          <small> Revenue: {{ totalRevenue | money }} </small>
          <!-- {{this.totalCash}}
        {{this.totalDeposit}}
        {{this.totalCard}}
        {{this.totalDepositCredit}}
        {{this.totalDepositDebit}} -->
        </div>
      </q-toolbar-title>
    </q-toolbar>
    <q-card-section class="q-pt-xs">
      <q-list>
        <template>
          <component
            :is="all ? 'my-table' : 'q-table'"
            flat
            :title="all ? 'All Sales' : ''"
            :data="data"
            row-key="id"
            :loading="isLoading"
            :pagination.sync="pager"
            :filter="filter"
            @request="fetchSales"
            v-bind="$attrs"
            ref="table"
          >
            <template #header>
              <tr class="bg-grey-3">
                <td rowspan="2">
                  Actions
                </td>
                <td rowspan="2">
                  #
                </td>
                <td rowspan="2" v-if="all">
                  Date
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
                <td :colspan="edcTypes.length" class="text-center">
                  Credit Card
                </td>
                <td :colspan="edcTypes.length" class="text-center">
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
                <td v-for="item in edcTypes" :key="`lcc${item.id}`">
                  {{ item.label }}
                </td>

                <td v-for="item in edcTypes" :key="`ldc${item.id}`">
                  {{ item.label }}
                </td>
              </tr>
            </template>
            <template #actions v-if="all">
              <date-range-input dense v-model="dates" />
            </template>
            <template #body="scoped">
              <q-tr
                class="mouse-pointer"
                :class="{
                  selected: selectedSales.id === scoped.row.id,
                  'text-negative': scoped.row.unpaid > 0
                }"
                @click.native="getSalesDetails(scoped.row.id, scoped.row)"
              >
                <td
                  :style="
                    scoped.row.isClosed
                      ? ''
                      : 'border-left:4px solid var(--q-color-positive);'
                  "
                >
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
                  <span v-if="!all">
                    {{ data.indexOf(scoped.row) + 1 }}
                  </span>
                  <span v-else>
                    {{
                      data.indexOf(scoped.row) +
                        1 +
                        (pager.page - 1) * pager.rowsPerPage
                    }}
                  </span>
                </td>
                <td v-if="all">
                  {{
                    $util.formatDate(scoped.row.createdAt, "DD MMM YY HH:mm")
                  }}
                  WIB
                </td>
                <td>
                  <q-badge
                    rounded
                    color="positive"
                    v-if="
                      scoped.row.note &&
                        scoped.row.note !== null &&
                        scoped.row.note.toLowerCase().indexOf('[total unpaid') <
                          -1
                    "
                  >
                    <q-tooltip content-class="bg-positive">
                      {{ scoped.row.note }}
                    </q-tooltip>
                  </q-badge>
                  {{ scoped.row.receiptCode }}
                  <q-badge
                    v-if="scoped.row.client"
                    :label="scoped.row.client.code"
                    class="q-ml-md"
                  />
                </td>
                <td class="text-right">
                  <q-badge
                    rounded
                    color="negative"
                    v-if="scoped.row.unpaid > 0"
                  >
                    <q-tooltip content-class="bg-negative">
                      Unpaid: {{ scoped.row.unpaid | money }}
                    </q-tooltip>
                  </q-badge>

                  {{ scoped.row.grandTotal | money }}
                </td>
                <td class="text-right">
                  {{ scoped.row.cash | money }}
                </td>
                <td class="text-right">
                  {{ scoped.row.transfer | money }}
                </td>
                <td
                  class="text-right"
                  v-for="item in edcTypes"
                  :key="`vdc${item.id}`"
                >
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
                <td
                  class="text-right"
                  v-for="item in edcTypes"
                  :key="`vcc${item.id}`"
                >
                  {{
                    (scoped.row.ccEdcType === item.id
                      ? scoped.row.creditCard
                      : 0) | money
                  }}
                </td>
              </q-tr>
            </template>
            <template #bottom-row>
              <tr class="bg-grey-3  text-bold">
                <td :colspan="all ? 4 : 3" class="text-center">
                  TOTAL
                  <span v-if="all"> of current page </span>
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
                <td
                  class="text-right"
                  v-for="item in edcTypes"
                  :key="`tcc${item.id}`"
                >
                  {{
                    data.reduce(
                      (a, b) =>
                        a + b.ccEdcType === item.id ? b.creditCard : 0,
                      0
                    ) | money
                  }}
                </td>
                <td
                  class="text-right"
                  v-for="item in edcTypes"
                  :key="`tdc${item.id}`"
                >
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
          </component>
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
import DateRangeInput from "src/components/DateRangeInput.vue";
export default {
  name: "SalesList",
  components: {
    SalesDetailsDialog,
    DateRangeInput
  },
  props: {
    deposits: {
      type: Array,
      default: () => []
    },
    all: {
      type: Boolean,
      default: () => false,
      comment: "default only show stil open receipts"
    }
  },
  data() {
    return {
      isLoading: false,
      data: [],
      saleLines: {},
      detailsDialog: false,
      selectedSales: new Sale(),
      isLoadingSalesLines: false,
      pager: {
        page: 1,
        rowsPerPage: this.all ? 25 : 5,
        rowsNumber: this.all ? 0 : undefined
      },
      filter: undefined,
      dates: []
    };
  },
  mounted() {
    this.fetchSales();
  },
  methods: {
    close() {
      this.data = [];
    },
    async fetchSales(pager) {
      if (this.isLoading) return;
      try {
        this.isLoading = true;
        pager = pager?.pagination || this.pager;

        if (this.dates.length) {
          pager.date1 = this.dates[0];
          if (this.dates.length > 1) {
            pager.date2 = this.dates[1];
          } else {
            pager.date2 = undefined;
          }
        } else {
          pager.date1 = undefined;
          pager.date2 = undefined;
        }

        let res;
        if (!this.all) {
          res = await this.$api.sales.getToday();
          this.data = res.data.map(x => new Sale(x));
        } else {
          res = await this.$api.sales.get(pager);
          let dt = res.data;
          this.data = dt.rows.map(x => new Sale(x));

          // this.columns = this.columns.map(x => {
          //   return Object.assign({}, x, {
          //     sortable: dt.sortColumns.indexOf(x.field.toLowerCase()) > -1
          //   });
          // });

          this.pager.rowsNumber = dt.rowsNumber;
          this.pager.page = dt.page;
          this.pager.sortBy = dt.sortBy;
          this.pager.descending = dt.descending;
          this.pager.rowsPerPage = dt.rowsPerPage;
        }
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
  watch: {
    dates() {
      this.fetchSales();
    }
  }
};
</script>
