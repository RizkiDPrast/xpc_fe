<template>
  <div>
    <my-table
      title="Book entry list"
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
      <template #body-cell-attachments="scoped">
        <q-td align="left">
          <div style="width:100px">
            <q-item v-if="scoped.row.attachmentCount">
              <q-item-section>
                {{ scoped.row.attachmentCount }} file{{
                  scoped.row.attachmentCount > 1 ? "s" : ""
                }}
              </q-item-section>
              <q-item-section side>
                <q-btn icon="las la-ellipsis-v" flat dense>
                  <q-menu>
                    <q-item v-for="item in scoped.row.appFiles" :key="item.id">
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
    </my-table>
  </div>
</template>

<script>
import CashBookEntry from "src/models/CashBookEntry";
// import CashBookEntryLine from "src/models/CashBookEntryLine";

export default {
  name: "BookEntryList",
  components: {},
  props: {},
  data() {
    return {
      isLoading: false,
      filter: undefined,
      columns: [
        {
          name: "action",
          align: "left",
          field: "actions",
          label: "Actions",
          sortable: false
        },
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
          field: "date",
          label: "Date",
          style: "width:50px",
          sortable: true,
          format: val => this.$util.toDateString(val)
        },
        {
          name: "code",
          align: "left",
          field: "code",
          label: "Code",
          style: "width:50px",
          sortable: true
        },
        {
          name: "description",
          align: "left",
          field: "description",
          label: "Description",
          sortable: true
        },
        {
          name: "value",
          align: "right",
          field: "value",
          label: "Value",
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
          name: "modifiedByName",
          align: "left",
          field: "modifiedByName",
          label: "Last modified by",
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
      pagination: { sortBy: "id", descending: true }
    };
  },
  mounted() {
    this.onRequest();
  },
  methods: {
    async search(filter, showIncomplete) {
      this.filter = filter;
      this.pagination.filter = filter;
      this.pagination.showIncompleteReceipt = showIncomplete;
      await this.onRequest();
    },
    async onRequest(props) {
      this.isLoading = true;
      try {
        const pagination = (props && props.pagination) || this.pagination;
        const res = await this.$api.gl.bookEntries.get(pagination);
        const data = res.data;
        const model = data.rows.map(x => new CashBookEntry(x));
        this.pagination.page = data.page;
        this.pagination.rowsPerPage = data.rowsPerPage;
        this.pagination.sortBy = data.sortBy;
        this.pagination.descending = data.descending;
        this.pagination.rowsNumber = data.rowsNumber;

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
