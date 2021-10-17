<template>
  <div>
    <page-header>
      <template #actions>
        
      </template>
    </page-header>
    <my-table
      :title="`Unpaid items`"
      :loading="loading"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pager"
      :filter="filter"
      @request="fetch"
      addBtnClass="hidden"
    >
  
    </my-table>
  </div>
</template>

<script>
export default {
  name:"Unpaid items",
  data() {
    return {
      loading: false,
      data: [],
       columns: [
        {
          name: "receipt",
          label: "In Receipt",
          field: (row)=> `${row.sale?.receiptCode}`,
          align: "left",
        },
        {
          name: "createdat",
          label: "Created at",
          field: 'createdAt',
          align: "left",
          format: val => this.$util.toDateString(val)
        },
        {
          name: "itemname",
          label: "Item",
          field: 'itemName',
          align: "left"
        },      
        {
          name: "qty",
          label: "Qty",
          field: 'qty',
          align: "right"
        },
        {
          name: "unitid",
          label: "Unit",
          field: (row) => this.getUnitName(row.unitId),
          align: "left"
        },
        {
          name: "unitPrice",
          label: "Unit Price",
          field: (row) => this.$options.filters.money(row.unitPrice),
          align: "right"
        },        
      ],
      pager: {
        page: 1,
        rowsPerPage: 25,
        rowsNumber: 0
      },
      filter: undefined,
    };
  },
  mounted() {
    this.fetch();
  },
  watch: {
   
  },
  methods: {
    async fetch(pager) {
      if (this.loading) return;
      this.loading = true;

       pager = pager?.pagination || this.pager;
      try {
        var res = await this.$api.unfinishedItems.getUnpaidSaleLine();
        var dt = res.data;
        this.data = dt.rows.map(x => x);

        //  this.columns = this.columns.map(x => {
        //   return Object.assign({}, x, {
        //     sortable: dt.sortColumns.indexOf(x.name.toLowerCase()) > -1
        //   });
        // });

        this.pager.rowsNumber = dt.rowsNumber;
        this.pager.page = dt.page;
        this.pager.sortBy = dt.sortBy;
        this.pager.descending = dt.descending;
        this.pager.rowsPerPage = dt.rowsPerPage;

      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    }
  
  }
};
</script>
