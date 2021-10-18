<template>
  <div>
    <q-btn
      v-bind="$attrs"
      flat
      icon="las la-file-alt"
      label="Summary"
      color="secondary"
      @click="model = true"
    />
    <q-dialog v-model="model" full-width full-height>
      <q-card>
        <dialog-header title="Daily Sales Summary">
          <template #actions>
            <q-badge color="negative" v-if="details.id === 0">
              Open
            </q-badge>
            <DatePrevNextSalesmanager
              v-model="date"
              @loading="loadingFn"
              @detail-fetched="fetched"
            />
          </template>
        </dialog-header>
        <my-circular-progress v-if="loading" class="full-width text-center" />
        <q-card-section
          v-else
          style="min-width:300px;min-width:500px"
          class="row"
        >
          <q-markup-table class="table col-4" bordered dense flat>
            <tr class="text-primary">
              <th>Payment</th>
              <th style="text-align:right!important">Total</th>
            </tr>
            <tr>
              <th>Cash</th>
              <td>
                {{
                  details.sales.reduce((a, b) => a + b.cash - b.change, 0)
                    | money
                }}
              </td>
            </tr>
            <tr>
              <th>Transfer</th>
              <td>
                {{ details.sales.reduce((a, b) => a + b.transfer, 0) | money }}
              </td>
            </tr>
            <tr>
              <th>Deposit</th>
              <td>
                {{ details.sales.reduce((a, b) => a + b.deposit, 0) | money }}
              </td>
            </tr>
            <tr v-for="item in edcTypes" :key="'cc' + item.id">
              <th>Credit Card {{ item.label }}</th>
              <td>
                {{
                  details.sales.reduce(
                    (a, b) => (b.ccEdcType === item.id ? a + b.creditCard : 0),
                    0
                  ) | money
                }}
              </td>
            </tr>
            <tr v-for="item in edcTypes" :key="'dc' + item.id">
              <th>Debit Card {{ item.label }}</th>
              <td>
                {{
                  details.sales.reduce(
                    (a, b) => (b.dcEdcType === item.id ? a + b.debitCard : 0),
                    0
                  ) | money
                }}
              </td>
            </tr>
          </q-markup-table>

          <q-markup-table class="table col-4" bordered dense flat>
            <tr class="text-positive">
              <th>Expenditure</th>
              <th style="text-align:right!important">Total</th>
            </tr>
            <tr
              v-for="item in details.cashInOuts.filter(
                x =>
                  x.saleId === null &&
                  !x.transferToSales &&
                  x.cashOut > 0 &&
                  x.cashOut > x.cashIn
              )"
              :key="item.id"
            >
              <th>{{ item.note }}</th>
              <td :class="{ 'text-negative': item.cashIn < item.cashOut }">
                {{ (item.cashIn - item.cashOut) | money }}
              </td>
            </tr>
          </q-markup-table>

          <q-markup-table class="table col-4" bordered dense flat>
            <tr class="text-secondary">
              <th>Deposit transactions</th>
              <th style="text-align:right!important">Total</th>
            </tr>
            <tr v-for="item in details.depositTransactions" :key="item.id">
              <th>[{{ item.depositCode }}] {{ item.note }}</th>
              <td :class="{ 'text-negative': item.credit < item.debit }">
                {{ (item.credit - item.debit) | money }}
              </td>
            </tr>
          </q-markup-table>

          <!--total -->

          <q-markup-table class="col-4">
            <tr class="bg-grey-3">
              <th class="text-bold">Total</th>
              <td class=" text-right">
                {{
                  details.sales.reduce((a, b) => a + b.totalPayment, 0) | money
                }}
              </td>
            </tr>
            <tr class="bg-grey-3">
              <th class="text-negative text-bold">Unpaid</th>
              <td class="text-negative text-right">
                {{
                  details.sales.reduce((a, b) => a + b.totalUnpaid, 0) | money
                }}
              </td>
            </tr>
          </q-markup-table>

          <q-markup-table class="col-4">
            <tr class="bg-grey-3">
              <th class="text-bold">Total</th>
              <td class="text-negative text-right">
                {{
                  details.cashInOuts
                    .filter(
                      x =>
                        x.saleId === null &&
                        x.cashOut > 0 &&
                        !x.transferToSales &&
                        x.cashOut > x.cashIn
                    )
                    .reduce((a, b) => a + b.cashIn - b.cashOut, 0) | money
                }}
              </td>
            </tr>
          </q-markup-table>

          <q-markup-table class="col-4">
            <tr class="bg-grey-3">
              <th class="text-bold">Total</th>
              <td class="text-right">
                {{
                  details.depositTransactions.reduce(
                    (a, b) => a + b.credit - b.debit,
                    0
                  ) | money
                }}
              </td>
            </tr>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import DatePrevNextSalesmanager from "components/DatePrevNextSalesmanager";
import Sale from "src/models/Sale";
export default {
  name: "SaleSummaryBtn",
  components: {
    DatePrevNextSalesmanager
  },
  data() {
    return {
      model: false,
      date: new Date(),
      loading: false,
      details: {
        id: undefined,
        sales: [],
        cashInOuts: [],
        depositTransactions: []
      }
    };
  },
  computed: {
    edcTypes() {
      return this.$store.state.list.edcTypes;
    }
  },
  methods: {
    loadingFn(val) {
      this.loading = val;
    },
    fetched(model) {
      // this.details = model;
      this.details.id = model.id;
      this.details.sales = model.sales.map(x => new Sale(x));
      this.details.cashInOuts = model.cashInOuts;
      this.details.depositTransactions = model.depositTransactions;
    }
  }
};
</script>
<style scoped>
.table th {
  text-align: left;
}
.table td {
  text-align: right;
}
</style>
