<template>
  <div>
    <q-card-section title class="text-h6" style="padding-bottom:0">
      <q-toolbar v-if="allCurrentDeposit">
        Total deposit from all clients: {{ allCurrentDeposit | money }}
      </q-toolbar>
      <q-toolbar>
        <q-toolbar-title>
          Deposit transaction today
        </q-toolbar-title>
        <q-btn
          size="sm"
          icon="las la-plus"
          :disable="isLoading"
          @click="addDialog = true"
        />
      </q-toolbar>
    </q-card-section>
    <q-card-section class="q-pt-xs" style="padding-top:0">
      <q-list>
        <q-card v-if="!hasItem">
          <q-card-section>
            No deposit Transactions
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
              <tr class="bg-primary text-white">
                <td>
                  #
                </td>
                <td>
                  Receipt
                </td>
                <td>
                  Customer
                </td>
                <td class="text-negative">
                  In
                </td>
                <td>
                  Out
                </td>
                <td>
                  Description
                </td>
                <td>
                  Actions
                </td>
              </tr>
            </template>
            <template #body="scoped">
              <tr>
                <td>
                  {{ data.indexOf(scoped.row) + 1 }}
                </td>
                <td>
                  {{ scoped.row.depositCode }}
                </td>
                <td>
                  {{ scoped.row.clientName }}
                </td>
                <td class="text-negative">
                  {{ scoped.row.credit | money }}
                </td>
                <td>
                  {{ scoped.row.debit | money }}
                </td>
                <td>
                  {{ scoped.row.note }}
                </td>
                <td>
                  <q-btn
                    :disable="false"
                    icon="las la-print"
                    size="sm"
                    round
                    text-color="primary"
                    title="print"
                    @click="printDeposit(scoped.row.id, scoped.row)"
                  />
                </td>
              </tr>
            </template>
            <template #bottom-row>
              <tr class="bg-secondary text-white">
                <td colspan="3" class="text-center">
                  TOTAL
                </td>
                <td>
                  {{ data.reduce((a, b) => a + b.credit, 0) | money }}
                </td>
                <td>
                  {{ data.reduce((a, b) => a + b.debit, 0) | money }}
                </td>
                <td></td>
                <td></td>
              </tr>
            </template>
          </q-table>
        </template>
      </q-list>
    </q-card-section>
    <add-deposit-dialog
      v-model="addDialog"
      @added="depositAddedHandle"
      :depositTransaction="selectedDeposit"
    />
  </div>
</template>

<script>
import DepositTransaction from "src/models/DepositTransaction";
import AddDepositDialog from "./AddDepositDialog";
export default {
  name: "DepositTodayList",
  components: {
    AddDepositDialog
  },
  data() {
    return {
      allCurrentDeposit: undefined,
      isLoading: false,
      addDialog: false,
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
    this.fetchDeposit();
  },
  watch: {
    data(val) {
      this.$emit("input", val);
    }
  },
  computed: {
    hasItem() {
      return this.data.length;
    }
  },
  methods: {
    async fetchDeposit() {
      try {
        if (this.isLoading) return;

        this.isLoading = true;
        let res = await this.$api.deposits.getToday();
        this.data = res.data.map(x => new DepositTransaction(x));

        // get Total all times
        res = await this.$api.deposits.getTotal();
        this.allCurrentDeposit = res.data;
      } catch (e) {
        this.$toastr.error(e.message);
      }
      this.isLoading = false;
    },
    depositAddedHandle(deposit) {
      this.data.push(deposit);
      if (this.$store.state.config.autoPrintDepositOnSave) {
        this.printDeposit(deposit.id, deposit);
      }
    },
    close() {
      this.data = [];
    },
    printDeposit(id, row) {
      this.selectedDeposit = row;
      // this.printDepositProtocol(this.selectedDeposit.id);
      this.$router.push({
        name: "printDeposit",
        // params: { id: this.selectedDeposit.id }
        params: { depositTransaction: this.selectedDeposit }
      });
    }
  }
};
</script>
