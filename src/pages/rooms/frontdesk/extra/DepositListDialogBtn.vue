<template>
  <div>
    <q-btn v-bind="$attrs" @click="dialog = true" />
    <q-dialog v-model="dialog" full-width full-height>
      <q-card>
        <dialog-header
          title="Deposit transaction"
          class="text-white bg-secondary"
        />
        <q-card-section>
          <my-table
            :loading="loading"
            :data="data"
            :columns="columns"
            row-key="id"
            :pagination.sync="pager"
            :filter="filter"
            @request="fetch"
            addBtnClass="hidden"
          >
            <template #actions>
              <date-input dense label="Date filter" v-model="createdAt" />
            </template>
            <template #body-cell-paymentType="props">
              <q-td align="center">
                <payment-type-select
                  outlined
                  dense
                  :value="props.row.paymentType"
                  readonly
                />
              </q-td>
            </template>
          </my-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import DialogHeader from "src/components/DialogHeader.vue";
import DateInput from "src/components/DateInput.vue";
import PaymentTypeSelect from "src/components/PaymentTypeSelect.vue";
export default {
  components: { DialogHeader, DateInput, PaymentTypeSelect },
  name: "DepositListDialogBtn",
  data() {
    return {
      dialog: false,
      loading: false,
      data: [],
      columns: [
        {
          name: "createdat",
          label: "Created at",
          field: "createdAt",
          width: "25px",
          format: val => this.$util.toDateString(val, true)
        },
        {
          name: "depositcode",
          label: "Code",
          field: "depositCode"
        },
        {
          name: "clientId",
          label: "Client",
          field: "clientName",
          align: "left"
        },
        {
          name: "credit",
          label: "Masuk",
          field: "credit",
          align: "right",
          format: val => this.$options.filters.money(val)
        },
        {
          name: "debit",
          label: "Keluar",
          field: "debit",
          align: "right",
          format: val => this.$options.filters.money(val)
        },
        {
          name: "note",
          label: "Notes",
          field: "note",
          align: "left"
        },
        {
          name: "group",
          label: "Group",
          field: "isForBoarding",
          format: val => (val ? "BOARDING" : "")
        },
        {
          name: "paymentType",
          label: "Payment type",
          field: "paymentType",
          align: "left"
        },
        {
          name: "id",
          label: "ID",
          field: "id",
          align: "left"
        }
      ],
      pager: {
        page: 1,
        rowsPerPage: 25,
        rowsNumber: 0
      },
      filter: undefined,
      createdAt: null
    };
  },
  mounted() {
    this.fetch();
  },
  watch: {
    createdAt() {
      this.fetch();
    }
  },
  methods: {
    async fetch(pager) {
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      if (this.createdAt) {
        pager.date = this.createdAt;
      } else {
        pager.date = null;
      }
      try {
        var res = await this.$api.deposits.get(pager);
        var dt = res.data;
        this.data = dt.rows.map(x => x);

        this.columns = this.columns.map(x => {
          return Object.assign({}, x, {
            sortable: dt.sortColumns.indexOf(x.field.toLowerCase()) > -1
          });
        });

        this.pager.rowsNumber = dt.rowsNumber;
        this.pager.page = dt.page;
        this.pager.sortBy = dt.sortBy;
        this.pager.descending = dt.descending;
        this.pager.rowsPerPage = dt.rowsPerPage;
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    }
  }
};
</script>
