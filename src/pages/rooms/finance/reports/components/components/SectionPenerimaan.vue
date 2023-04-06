<template>
  <section
    class="row col-md-12 penerimaan q-col-gutter-md"
    style="margin:6px 0"
  >
    <q-toolbar>
      <q-toolbar-title>Penerimaan</q-toolbar-title>
    </q-toolbar>
    <div class="col-12 col-md-6" style="padding-top:0;padding-top:6px;">
      <q-card>
        <q-card-section>
          <q-toolbar>
            <b>Penerimaan usaha</b>
          </q-toolbar>
          <my-table
            :loading="loading1"
            :data="data1"
            row-key="id"
            :pagination.sync="pager1"
            :filter="filter1"
            @request="fetch1"
            :searchOnly="false"
            addBtnClass="hidden"
            deleteBtnClass="hidden"
            editBtnClass="hidden"
          />
        </q-card-section>
      </q-card>
    </div>
    <div class="col-12 col-md-6" style="padding-top:0;padding-top:6px;">
      <q-card>
        <q-card-section>
          <q-toolbar>
            <b>Penerimaan lain</b>
          </q-toolbar>
          <my-table
            :loading="loading2"
            :data="data2"
            row-key="id"
            :pagination.sync="pager2"
            :filter="filter2"
            @request="fetch2"
            :searchOnly="false"
            addBtnClass="hidden"
            deleteBtnClass="hidden"
            editBtnClass="hidden"
          />
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>
<script>
export default {
  name: "SectionPenerimaan",
  props: {
    startDate: {
      type: Date,
      default: () => null
    },
    endDate: {
      type: Date,
      default: () => null
    },
    label: {
      type: String || undefined,
      default: () => ""
    }
  },
  data() {
    return {
      loading1: false,
      data1: [],
      pager1: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      filter1: undefined,

      loading2: false,
      data2: [],
      pager2: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      filter2: undefined
    };
  },
  watch: {
    startDate(nval, oval) {
      this.refresh();
    }
  },
  methods: {
    refresh() {
      this.fetch1();
      this.fetch2();
    },
    async fetch1(pager) {
      if (this.loading1) return;
      this.loading1 = true;
      pager = pager?.pagination || this.pager1;

      try {
        pager.startDate = this.startDate;
        pager.endDate = this.endDate;

        var res = await this.$api.reports.getPenerimaanUsaha(pager);
        var dt = res.data;
        this.data1 = dt.rows.map(x => x);

        // this.columns = this.columns.map(x => {
        //   return Object.assign({}, x, {
        //     sortable: dt.sortColumns.indexOf(x.field.toLowerCase()) > -1
        //   });
        // });

        this.pager1.rowsNumber = dt.rowsNumber;
        this.pager1.page = dt.page;
        this.pager1.sortBy = dt.sortBy;
        this.pager1.descending = dt.descending;
        this.pager1.rowsPerPage = dt.rowsPerPage;
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading1 = false;
    },
    async fetch2(pager) {
      if (this.loading2) return;
      this.loading2 = true;
      pager = pager?.pagination || this.pager2;

      try {
        pager.startDate = this.startDate;
        pager.endDate = this.endDate;

        var res = await this.$api.reports.getPenerimaanLain(pager);
        var dt = res.data;
        this.data1 = dt.rows.map(x => x);

        // this.columns = this.columns.map(x => {
        //   return Object.assign({}, x, {
        //     sortable: dt.sortColumns.indexOf(x.field.toLowerCase()) > -1
        //   });
        // });

        this.pager2.rowsNumber = dt.rowsNumber;
        this.pager2.page = dt.page;
        this.pager2.sortBy = dt.sortBy;
        this.pager2.descending = dt.descending;
        this.pager2.rowsPerPage = dt.rowsPerPage;
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading2 = false;
    }
  }
};
</script>
