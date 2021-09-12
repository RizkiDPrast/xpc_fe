<template>
  <div>
    <q-card-section title class="text-h6" style="padding-bottom:0">
      <q-toolbar v-if="cashInHand > -1">
        Total Cash in hand: {{ cashInHand | money }}
      </q-toolbar>
      <q-banner class="bg-grey-3">
        Cash payment from Sale will also be added
      </q-banner>
      <q-toolbar>
        <q-toolbar-title>
          Cash in out
        </q-toolbar-title>
        <q-btn
          size="sm"
          icon="las la-plus"
          :disable="isLoading"
          @click="addDialog = true"
          flat
        />
         <q-btn
          size="sm"
          icon="las la-plus"
          label="KASBON"
          class="q-ml-sm"
          flat
          text-color="secondary"
          :disable="isLoading"
          @click="addCashAdvanceDialog = true"
        />
      </q-toolbar>
    </q-card-section>
    <q-card-section class="q-pt-xs" style="padding-top:0">
      <q-list>
        <q-card v-if="!hasItem">
          <q-card-section>
            No cash in hand Transactions
          </q-card-section>
        </q-card>

        <template v-else>
          <q-table
            title=""
            :data="data"
            :columns="columns"
            row-key="id"
            :loading="isLoading"
            flat
          >
            <template #header>
              <tr class="bg-primary text-white">
                <td>
                  #
                </td>
                <td>
                  Note
                </td>
                <td class="">
                  Cash In
                </td>
                <td>
                  Cash Out
                </td>
                <td class="">
                  Line Total
                </td>
              </tr>
            </template>
            <template #body="scoped">
              <tr>
                <td>
                  {{ data.indexOf(scoped.row) + 1 }}
                </td>
                <td>
                  {{ scoped.row.note }}
                </td>
                <td class="">
                  {{ scoped.row.cashIn | money }}
                </td>
                <td>
                  {{ scoped.row.cashOut | money }}
                </td>
                <td>
                  {{ (scoped.row.cashIn - scoped.row.cashOut) | money }}
                </td>
              </tr>
            </template>
            <template #bottom-row>
              <tr class="bg-secondary text-white">
                <td colspan="2" class="text-center">
                  TOTAL
                </td>
                <td>
                  {{ data.reduce((a, b) => a + b.cashIn, 0) | money }}
                </td>
                <td>
                  {{ data.reduce((a, b) => a + b.cashOut, 0) | money }}
                </td>
                <td>
                  {{
                    data.reduce((a, b) => a + b.cashIn - b.cashOut, 0) | money
                  }}
                </td>
              </tr>
            </template>
          </q-table>
        </template>
      </q-list>
    </q-card-section>
    <add-cash-in-out-dialog v-model="addDialog" @added="cashInOutAddedHandle" />
    <add-cash-advance-dialog v-model="addCashAdvanceDialog" @added="cashInOutAddedHandle" />
  </div>
</template>

<script>
import AddCashInOutDialog from "./AddCashInOutDialog";
import AddCashAdvanceDialog from './AddCashAdvanceDialog'
export default {
  name: "CashInOutList",
  components: {
    AddCashInOutDialog,
    AddCashAdvanceDialog
  },
  data() {
    return {
      allCurrentDeposit: undefined,
      isLoading: false,
      addDialog: false,
      addCashAdvanceDialog:false,
      columns: [
        {
          name: "id",
          required: true,
          format: (val, row) => this.data.indexOf(row) + 1,
          style: "width: 25px",
          label: "#"
        },
        {
          name: "depositCode",
          align: "left",
          field: "depositCode",
          label: "Receipt",
          style: "width:50px",
          sortable: true
        },
        {
          name: "clientName",
          align: "left",
          field: "clientName",
          label: "Cust Name",
          sortable: true,
          format: (val, row) => val
        },
        {
          name: "credit",
          align: "right",
          field: "credit",
          label: "kredit",
          sortable: true
        },
        {
          name: "debit",
          align: "right",
          field: "debit",
          label: "Debit"
        },
        {
          name: "note",
          align: "left",
          field: "note",
          label: "Note",
          sortable: true
        }
      ],
      data: [],
      selectedDeposit: undefined
    };
  },
  mounted() {
    this.fetch();
  },
  watch: {
    data(val) {
      this.$emit("input", val);
    }
  },
  computed: {
    hasItem() {
      return this.data.length;
    },
    cashInHand() {
      return this.data.reduce((a, b) => a + b.cashIn - b.cashOut, 0);
    }
  },
  methods: {
    async fetch() {
      try {
        if (this.isLoading) return;

        this.isLoading = true;
        let res = await this.$api.cashInOuts.getToday();
        this.data = res.data.map(x => x);
      } catch (e) {
        this.$toastr.error(e.message);
      }
      this.isLoading = false;
    },
    cashInOutAddedHandle(model) {
      this.data.push(model);
    },
    close() {
      this.data = [];
    }
  }
};
</script>
