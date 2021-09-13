<template>
  <div>
    <q-btn flat round icon="las la-cogs" text-color="secondary" @click="model = true" >
      <q-tooltip content-class="bg-secondary">
        Update default salary lines for users
      </q-tooltip>
    </q-btn>
    <q-dialog v-model="model" full-width>
      <q-card flat bordered>
        <dialog-header title="Manage User Default Salary Lines" class="bg-secondary text-white" />
        <q-card-section class="row">
          <div class="col-6">
            <my-table
              title=""
              :loading="loading"
              :data="data"
              :columns="columns"
              row-key="id"
              :pagination.sync="pager"
              :filter="filter"
              @request="fetch"
              addBtnClass="hidden"
              @row-click="rowClick"
            >
              <template #body-cell-avatar="props">
                <q-td
                  class="text-center"
                  :class="{ selected: props.row.id === user.id }"
                >
                  <user-avatar :value="props.row" size="sm" />
                </q-td>
              </template>
            </my-table>
          </div>
          <div class="col-6">
            <q-card flat v-if="user && user.id">
              <q-toolbar>
          <user-avatar :value="user" size="lg" />
          <q-toolbar-title>
            {{ user.displayName || user.userName }}'s default salary lines
            <q-item-label caption>
              {{ user.email }} / {{ user.phone }}
            </q-item-label>
          </q-toolbar-title>
        </q-toolbar>
          <q-banner v-if="loadingD2">
            <my-circular-progress /> Getting default salary lines for current user ...
          </q-banner>
            <q-markup-table flat class="my-table q-pa-md" v-else>
                    <tr class="bg-grey-3">
                      <th colspan="">Earnings</th>
                      <td>
                        <AddUserSalaryLineBtn
                          :userId="user.id"
                          flat
                          round
                          size="sm"
                          dense
                          icon="las la-plus"
                          @added="added"
                          title="Add Default Earning"
                        />
                      </td>
                    </tr>
                    <tr v-if="!earnings.length"><td colspan="2"> Tidak ada data </td></tr>
                    <tr
                    v-else
                      v-for="item in earnings"
                      :key="item.id"
                    >
                      <th class="q-pl-sm">
                        <q-btn
                          flat
                          round
                          dense
                          size="sm"
                          icon="las la-trash"
                          text-color="negative"
                          @click="deleteLine(item)"
                        />
                        {{item.description}}
                      </th>
                      <td>{{ item.value | money }}</td>
                    </tr>
                    <tr>
                      <td style="height:25px;"></td>
                    </tr>
                    <tr class="bg-grey-3 q-mt-sm">
                      <th>Deductions</th>
                      <td>
                         <AddUserSalaryLineBtn
                          deduction
                         :userId="user.id"
                          flat
                          round
                          size="sm"
                          dense
                          icon="las la-plus"
                          @added="added"
                          title="Add Default Deduction"
                        />
                      </td>
                    </tr>
                    <tr v-if="!deductions.length"><td colspan="2"> Tidak ada data </td></tr>
                     <tr
                     v-else
                      v-for="item in deductions"
                      :key="item.id"
                    >
                      <th class="q-pl-sm">
                        <q-btn
                          flat
                          round
                          dense
                          size="sm"
                          icon="las la-trash"
                          text-color="negative"
                          @click="deleteLine(item)"
                        />
                        {{item.description}}
                      </th>
                      <td>{{ -item.value | money }}</td>
                    </tr>
                  </q-markup-table>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import AddUserSalaryLineBtn from './AddUserSalaryLineBtn.vue'
export default {
  name: "UserDefaultSalaryLinesBtn",
  props: {},
  components:{
    AddUserSalaryLineBtn
  },
  data() {
    return {
 
         loading: false,
      model: false,
      data: [],
      columns: [
        {
          name: "avatar",
          label: "Avatar",
          field: "avatar",
          align: "center"
        },
        {
          name: "userName",
          label: "Name",
          field: "userName",
          align: "left",
          format: (val, row) =>
            row.displayName && row.displayName !== null ? row.displayName : val
        },
        {
          name: "roleName",
          label: "Role",
          field: "roleName",
          align: "left"
        },
        {
          name: "Notes",
          label: "Notes",
          field: "notes",
          align: "left"
        }
      ],
      pager: {
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0
      },
      filter: undefined,
      user: {},
      loadingD2: false,
      data2: [],
      deleting: false,
    };
  },
  watch: {
    'user.id'(){
      this.fetchD2()
    }
  },
  mounted() {
    this.fetch();
  },
  computed:{
    earnings(){
      if(!this.data2.length) return []
      return this.data2.filter(x => x.value >= 0)
    },
    deductions(){
      if(!this.data2.length) return []
      return this.data2.filter(x => x.value < 0)
    }
  },
  methods: {
    rowClick(ev, row) {
      this.user = row;
    },
    async fetch(pager) {
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      try {
        var res = await this.$api.users.get(pager);
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
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    },
    async fetchD2() {
      if(!this.user.id) return;
      if (this.loadingD2) return;
      this.loadingD2 = true;
     try {
        var res = await this.$api.salaries.getDefaultLines(this.user.id);
        var dt = res.data;
        this.data2 = dt.map(x => x);

      } catch (e) {
        this.$toastr.error(e);
      }
      this.loadingD2 = false;
    },
    added(model){
      this.data2.push(model)
    },
    async deleteLine(model){
      if(!confirm('Are you sure want to delete this record?')){
        return;
      } else {
        if(this.deleting) return;
        this.deleting = true
        try {
          let res = await this.$api.salaries.deleteDefaultLine(model.userId, model.id)
          this.$toastr.success('Record was deleted')
          this.data2 = this.data2.filter(x => x.id !== model.id)
        } catch (error) {
          this.$toastr.error(error)
        }
        this.deleting = false

      }
    }
  }
};
</script>

<style scoped>
td.selected {
  border-left: 4px solid var(--q-color-secondary);
}
</style>