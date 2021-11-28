<template>
  <div>
    <page-header>
      <template #actions> </template>
    </page-header>
    <my-table
      :title="
        `Unpaid receipts ${
          !data.length
            ? ''
            : ' - Tot: ' +
              $options.filters.money(data.reduce((a, b) => a + b.unpaid, 0))
        }`
      "
      :loading="loading"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pager"
      :filter="filter"
      @request="fetch"
      addBtnClass="hidden"
      grid
      bordered
      dense
      card-class="shadow-3"
    >
      <template #item="props">
        <q-card
          style="min:width:300px;width:calc(100vh / 4 - 50)"
          class="q-ma-sm"
        >
          <q-toolbar>
            <q-toolbar-title>
              {{ props.row.receiptCode }}
            </q-toolbar-title>
            <q-btn
              round
              size="sm"
              icon="las la-list"
              @click="showDetails(props.row)"
            />
          </q-toolbar>
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>
                    Client
                  </q-item-label>
                  <q-item-label>
                    <span v-if="props.row.client && props.row.client !== null"
                      >{{ props.row.client.code }} -
                      {{ props.row.client.name }}</span
                    >
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>
                    Trx date
                  </q-item-label>
                  <q-item-label>
                    {{ $util.toDateString(props.row.saleDate) }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>
                    Total
                  </q-item-label>
                  <q-item-label>
                    {{ props.row.total | money }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>
                    Payment
                  </q-item-label>
                  <q-item-label>
                    {{ props.row.totalPayment | money }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>
                    Unpaid
                  </q-item-label>
                  <q-item-label>
                    {{ props.row.unpaid | money }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>
                    Note
                  </q-item-label>
                  <q-item-label>
                    {{ props.row.note }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </template>

      <!-- <template #body-cell-phone="props">
        <q-td>
          <template v-if="props.row.waPhone">
            <wa-btn :value="props.row.waPhone" />
            {{ props.row.waPhone }} <br />
          </template>
          <template v-if="props.row.otherPhones">
            Other phones: {{ props.row.otherPhones }}
          </template>
        </q-td>
      </template>
       <template #body-cell-acts="props">
        <q-td> {{ props.row }} asd </q-td>
      </template> -->
    </my-table>

    <sales-details-dialog v-model="detailsDialog" :sales="selectedSales" />
  </div>
</template>

<script>
import Sale from "src/models/Sale";
import SalesDetailsDialog from "../sales/components/SalesDetailsDialog.vue";
import SaleLine from "src/models/SaleLine";
export default {
  components: { SalesDetailsDialog },
  name: "UnpaidReceipts",
  data() {
    return {
      loading: false,
      data: [],
      columns: [
        {
          name: "client",
          label: "Client",
          field: row => `${row.client?.code} - ${row.client?.name}`,
          align: "left"
        },
        {
          name: "SaleDate",
          label: "Trx date",
          field: "saleDate",
          align: "left",
          format: val => this.$util.toDateString(val)
        },
        {
          name: "receiptcode",
          label: "Receipt Code",
          field: "receiptCode",
          align: "left",
          classes: "text-bold"
        },
        {
          name: "total",
          label: "Net Sales",
          field: "total",
          align: "right",
          format: val => this.$options.filters.money(val)
        },
        {
          name: "totalPayment",
          label: "Payment",
          field: "totalPayment",
          align: "right",
          format: val => this.$options.filters.money(val)
        },
        {
          name: "unpaid",
          label: "Total Unpaid",
          field: "unpaid",
          align: "right",
          format: val => this.$options.filters.money(val)
        },
        {
          name: "note",
          label: "Note",
          field: "note",
          align: "left"
        }
      ],
      pager: {
        page: 1,
        rowsPerPage: 25,
        rowsNumber: 0
      },
      filter: undefined,
      detailsDialog: false,
      selectedSales: {},
      saleLines: {},
      isLoadingSalesLines: false
    };
  },
  mounted() {
    this.fetch();
  },
  watch: {},
  methods: {
    async fetch() {
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.sales.getUnpaid();
        var dt = res.data;
        this.data = dt.map(x => new Sale(x));
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    },
    async showDetails(row) {
      await this.getSalesDetails(row.id, row);
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
    }
  }
};
</script>
