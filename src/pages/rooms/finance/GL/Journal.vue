<template>
  <div>
    <page-header></page-header>
    <my-table
      title="Journal"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
      :loading="isLoading"
      @request="onRequest"
      :filter="filter"
      @add="add"
      @edit="edit"
      @row-click="rowClick"
      delete-btn-class="hidden"
    >
      <template #actions>
        <account-select
          dense
          outlined
          v-model="accountCode"
          placeholder="Akun"
        />
        <date-input dense v-model="date" label="Filter date" />
      </template>
      <template #body-cell-attachments="scoped">
        <q-td align="left">
          <div style="width:100px">
            <q-item
              v-if="
                scoped.row.cashBookEntry &&
                  scoped.row.cashBookEntry.attachmentCount
              "
            >
              <q-item-section>
                {{ scoped.row.cashBookEntry.attachmentCount }} file{{
                  scoped.row.cashBookEntry.attachmentCount > 1 ? "s" : ""
                }}
              </q-item-section>
              <q-item-section side>
                <q-btn icon="las la-ellipsis-v" flat dense>
                  <q-menu>
                    <q-item
                      v-for="item in scoped.row.cashBookEntry.appFiles"
                      :key="item.id"
                    >
                      <q-item-section>
                        <a
                          style="text-decoration:none"
                          :href="item.fileUri"
                          target="_blank"
                          :alt="item.description"
                        >
                          {{ item.fileName }}
                        </a>
                      </q-item-section>
                    </q-item>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </q-item>
          </div>
        </q-td>
      </template>
      <template #bottom-row>
        <q-tr> </q-tr>
        <q-tr>
          <q-td colspan="4"> </q-td>
          <q-td align="right" v-if="customData" class="text-bold">
            {{ customData.debit | money }}
          </q-td>
          <q-td align="right" v-if="customData" class="text-bold">
            {{ customData.credit | money }}
          </q-td>
        </q-tr>
      </template>
    </my-table>
  </div>
</template>

<script>
import CashBookEntry from "src/models/CashBookEntry";
import DateInput from "src/components/DateInput.vue";
import PageHeader from "src/components/PageHeader.vue";
import AccountSelect from "./components/AccountSelect.vue";
// import CashBookEntryLine from "src/models/CashBookEntryLine";

export default {
  name: "BookEntryList",
  components: { DateInput, PageHeader, AccountSelect },
  props: {},
  data() {
    return {
      isLoading: false,
      filter: undefined,
      columns: [
        {
          name: "id",
          required: true,
          format: (val, row) => this.data.indexOf(row) + 1,
          style: "width: 25px",
          label: "#"
        },
        {
          name: "date",
          align: "left",
          field: "createdAt",
          label: "Date",
          style: "width:50px",
          sortable: true,
          format: val => this.$util.toDateString(val)
        },
        {
          name: "code",
          align: "left",
          field: "accountCode",
          label: "Account",
          format: (val, row) => `${row.accountCode} - ${row.accountDescription}`
        },
        {
          name: "description",
          align: "left",
          field: "description",
          label: "Description",
          sortable: true
        },
        {
          name: "debit",
          align: "right",
          field: "debit",
          label: "Debit",
          sortable: false,
          format: (val, row) => this.$options.filters.money(val)
        },
        {
          name: "credit",
          align: "right",
          field: "credit",
          label: "Credit",
          sortable: false,
          format: (val, row) => this.$options.filters.money(val)
        },
        {
          name: "attachments",
          align: "left",
          field: "appFiles",
          label: "Attachments",
          sortable: true
        },
        {
          name: "createdBy",
          align: "left",
          field: "createdByName",
          label: "Created by",
          sortable: false
        }
      ],
      data: [],
      salesLines: {},
      detailsDialog: false,
      selectedSales: new CashBookEntry(),
      isLoadingSalesLines: false,
      printSalesDialog: false,
      updateSalesDialogModel: false,
      pagination: {
        sortBy: "id",
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      date: null,
      customData: {},
      accountCode: null
    };
  },
  mounted() {
    this.onRequest();
  },
  watch: {
    date() {
      this.onRequest();
    },
    accountCode() {
      this.onRequest();
    }
  },
  methods: {
    async search(filter, showIncomplete) {
      this.filter = filter;
      this.pagination.filter = filter;
      this.pagination.showIncompleteReceipt = showIncomplete;
      await this.onRequest();
    },
    async onRequest(pager) {
      this.isLoading = true;
      try {
        pager = pager?.pagination || this.pagination;

        if (this.date) {
          pager.date = this.date;
        } else {
          pager.date = null;
        }

        pager.accountCode = this.accountCode;

        const res = await this.$api.gl.journal.get(pager);
        const data = res.data;

        this.customData = data.customData;
        const model = data.rows.map(x => x);
        this.pagination.rowsNumber = data.rowsNumber;
        this.pagination.page = data.page;
        this.pagination.rowsPerPage = data.rowsPerPage;
        this.pagination.sortBy = data.sortBy;
        this.pagination.descending = data.descending;

        this.data.splice(0, this.data.length, ...model);
      } catch (e) {
        this.$toastr.error(e);
      }
      this.isLoading = false;
      return Promise.resolve();
    },
    edit(id) {
      // const supplier = this.data.filter((x) => x.id === id)[0]
      // console.log(supplier)
      // const dt = this.data.find(x => x.id === id);
      this.$router.push({
        path: `/app/rooms/finance/book-entries/${id}`
      });
    },
    add() {
      this.$router.push({
        path: `/app/rooms/finance/book-entries/0`
      });
    },
    rowClick(ev, val) {
      if (val.id && val.id > 0) {
        // this.edit(val.id);
      }
    }
  },
  computed: {
    hasItem() {
      return this.data.length > 0;
    }
  }
};
</script>
