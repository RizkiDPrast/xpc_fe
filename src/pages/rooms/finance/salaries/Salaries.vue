<template>
  <q-page>
    <page-header>
      <template #actions>
        <user-default-salary-lines-btn />
      </template>
    </page-header>
    <q-card-section class="row">
      <div class="col-8 q-pa-sm">
        <my-table
          title="Employee Salaries"
          :loading="loading"
          :data="data"
          :columns="columns"
          row-key="id"
          :pagination.sync="pager"
          :filter="filter"
          @request="fetch"
          @add="add"
          @edit="edit"
          @delete="del"
          @row-click="rowClick"
        >
          <template #body-cell-avatar="props">
            <q-td :class="{ selected: props.row.id === modelInput.id }">
              <user-avatar :value="props.row" size="sm" />
            </q-td>
          </template>
        </my-table>
      </div>
      <div class="col-4 q-pa-sm">
        <q-card class="my-card">
          <q-toolbar>
            <q-toolbar-title>
              Add / Details Salary
            </q-toolbar-title>
          </q-toolbar>
          <q-card-section>
            <q-form @submit="save" class="q-col-gutter-md full-width">
              <user-select
                v-model="modelInput.userId"
                name="User"
                v-validate="'required'"
                :error="errors.has('User')"
                :error-message="errors.first('User')"
                dense
                outlined
                label="User"
                :readonly="!newRecord"
              />
              <q-input
                ref="code"
                v-model="modelInput.code"
                name="code"
                v-validate="''"
                :error="errors.has('code')"
                :error-message="errors.first('code')"
                label="Code"
                autocomplete="off"
                dense
                outlined
                hint="Leave empty for auto-generated"
                :readonly="!newRecord"
              />
              <date-input
                v-model="modelInput.createdAt"
                name="createdAt"
                v-validate="'required'"
                :error="errors.has('createdAt')"
                :error-message="errors.first('createdAt')"
                label="Created at *"
                autocomplete="off"
                dense
                outlined
                hint="Limited per user per month"
                :readonly="!newRecord"
              />

              <q-card flat bordered class="q-mt-sm">
                <q-card-section>
                  <q-markup-table flat class="my-table">
                    <tr>
                      <td style="width:10%"></td>
                      <td style="width:50%"></td>
                      <td style="width:40%"></td>
                    </tr>
                    <tr class="bg-grey-3">
                      <th colspan="2">Earnings</th>
                      <td>
                        <salary-line-btn
                          flat
                          round
                          size="sm"
                          dense
                          icon="las la-plus"
                          @save="addEarning"
                          v-if="newRecord"
                          title="Add Earning"
                        />
                      </td>
                    </tr>
                    <tr
                      v-for="item in modelInput.salaryLines.filter(
                        x => x.value >= 0
                      )"
                      :key="item.id"
                    >
                      <td>
                        <div class="inline-flex">
                          <q-btn
                            flat
                            round
                            dense
                            size="sm"
                            icon="las la-trash"
                            text-color="negative"
                            @click="deleteLine(item.id)"
                            v-if="newRecord"
                          />
                          <salary-line-btn
                            flat
                            round
                            dense
                            size="sm"
                            icon="las la-pencil-alt"
                            text-color="warning"
                            @save="updateEarning"
                            :line="item"
                            v-if="newRecord"
                            title="Edit Earning"
                          />
                        </div>
                      </td>
                      <th class="q-pl-sm">
                        {{ item.description }}
                      </th>
                      <td>{{ item.value | money }}</td>
                    </tr>
                    <tr>
                      <td style="height:25px;"></td>
                    </tr>
                    <tr class="bg-grey-3 q-mt-sm">
                      <th colspan="2">Deductions</th>
                      <td>
                        <salary-line-btn
                          flat
                          round
                          size="sm"
                          dense
                          icon="las la-plus"
                          @save="addDeduction"
                          v-if="newRecord"
                          title="Add Deduction"
                        />
                      </td>
                    </tr>
                    <tr
                      v-for="item in modelInput.salaryLines.filter(
                        x => x.value < 0
                      )"
                      :key="item.id"
                    >
                      <td>
                        <div class="inline-flex">
                          <q-btn
                            flat
                            round
                            dense
                            size="sm"
                            icon="las la-trash"
                            text-color="negative"
                            @click="deleteLine(item.id)"
                            v-if="newRecord"
                          />
                          <salary-line-btn
                            deduction
                            flat
                            round
                            dense
                            size="sm"
                            icon="las la-pencil-alt"
                            text-color="warning"
                            @save="updateDeduction"
                            :line="item"
                            v-if="newRecord"
                            title="Update Deduction"
                          />
                        </div>
                      </td>
                      <th class="q-pl-sm">
                        {{ item.description }}
                      </th>
                      <td>{{ -item.value | money }}</td>
                    </tr>
                  </q-markup-table>
                </q-card-section>
              </q-card>
              <money-field
                label="Earnings"
                readonly
                :value="totEarnings"
                outlined
                dense
                class="q-mb-sm"
              />
              <money-field
                label="Deductions"
                readonly
                :value="totDeductions"
                outlined
                dense
                class="q-mb-sm"
              />
              <money-field
                label="Net Salary"
                input-class="text-bold"
                readonly
                :value="netSalary"
                outlined
                dense
                class="q-mb-sm text-bold"
                :error="netSalary < 0"
                :error-message="
                  netSalary < 0 ? 'Net salary must be greater than 0' : ''
                "
              />

              <q-btn
                :loading="loading"
                icon="las la-save"
                label="Save"
                title="Save"
                text-color="white"
                class="full-width q-mt-md"
                color="secondary"
                :disable="loading"
                @click.stop="save"
                v-if="newRecord"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>
  </q-page>
</template>

<script>
import SalaryLineBtn from "./components/SalaryLineBtn.vue";
import UserDefaultSalaryLinesBtn from "./components/UserDefaultSalaryLinesBtn.vue";
export default {
  components: {
    SalaryLineBtn,
    UserDefaultSalaryLinesBtn
  },
  name: "Salaries",
  data() {
    return {
      modelInput: {
        salaryLines: []
      },
      loading: false,
      data: [],
      columns: [
        // {
        //   name: "action",
        //   label: "action",
        //   field: "action",
        //   width: "25px",
        //   align: "center"
        // },
        {
          name: "avatar",
          label: "Avatar",
          field: row => row.user.avatar,
          align: "center"
        },
        {
          name: "code",
          label: "Code",
          field: "code",
          align: "left",
          classes: "text-bold"
        },
        {
          name: "createdat",
          label: "Created At",
          field: "createdAt",
          align: "left",
          format: val => this.$util.toDateString(val)
        },
        {
          name: "userName",
          label: "UserName",
          field: row => row.user.displayName || row.user.userName,
          align: "left"
        },
        {
          name: "earnings",
          label: "Earnings",
          field: "earnings",
          align: "right",
          format: val => this.$options.filters.money(val)
        },
        {
          name: "deductions",
          label: "Deductions",
          field: "deductions",
          align: "right",
          classes: "text-negative",
          format: val => this.$options.filters.money(-val)
        },
        {
          name: "netSalary",
          label: "Net Salary",
          field: "netSalary",
          align: "right",
          classes: "text-bold",
          format: val => this.$options.filters.money(val)
        }
      ],
      pager: {
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0
      },
      filter: undefined,
      mid: 0,
      loadingPreSalaryLines: false
    };
  },
  mounted() {
    this.fetch();
  },
  computed: {
    totEarnings() {
      return this.modelInput.salaryLines
        .filter(x => x.value >= 0)
        .reduce((a, b) => a + b.value, 0);
    },
    totDeductions() {
      return this.modelInput.salaryLines
        .filter(x => x.value < 0)
        .reduce((a, b) => a + -b.value, 0);
    },
    netSalary() {
      return this.modelInput.salaryLines.reduce((a, b) => a + b.value, 0);
    },
    newRecord() {
      return !(this.modelInput.id > 0);
    }
  },
  watch: {
    "modelInput.userId"(val) {
      this.modelInput.salaryLines = [];
      this.mid = 0;
      this.fetchPreSalaryLines();
    }
  },
  methods: {
    async fetchPreSalaryLines() {
      if (!this.modelInput.userId) return;
      if (this.loadingPreSalaryLines) return;
      this.loadingPreSalaryLines = true;
      try {
        let res = await this.$api.salaries.getPreSalaryLines(
          this.modelInput.userId
        );
        this.modelInput.salaryLines = res.data.map(x =>
          Object.assign({}, x, { id: --this.mid })
        );
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loadingPreSalaryLines = false;
    },
    addEarning(model) {
      this.mid--;
      model.id = this.mid;
      this.modelInput.salaryLines.push(model);
    },
    addDeduction(model) {
      this.mid--;
      model.id = this.mid;
      model.value = -model.value;
      this.modelInput.salaryLines.push(model);
    },
    updateEarning(model) {
      let m = this.modelInput.salaryLines.find(x => x.id === model.id);
      m.description = model.description;
      m.value = model.value;
    },
    updateDeduction(model) {
      let m = this.modelInput.salaryLines.find(x => x.id === model.id);
      m.description = model.description;
      m.value = -model.value;
    },
    deleteLine(id) {
      this.modelInput.salaryLines = this.modelInput.salaryLines.filter(
        x => x.id !== id
      );
    },
    async save() {
      if (!(await this.$validator.validateAll())) {
        this.$toastr.error("Please correct the form");
        return;
      }
      if (this.netSalary < 0) {
        this.$toastr.error("Please correct the form");
        return;
      }

      if (!this.modelInput.salaryLines.length) {
        this.$toastr.error("Please add at least 1 salary component");
        return;
      }

      if (this.loading) return;
      this.loading = true;

      let res;
      if (!this.modelInput.code || this.modelInput.code === null) {
        this.modelInput.code = "-";
      }
      let obj = JSON.parse(JSON.stringify(this.modelInput));
      try {
        if (obj.id) {
          this.$toastr.error("Updating was not allowed");
          return;
        } else {
          for (let line of obj.salaryLines) {
            line.id = 0;
          }
          res = await this.$api.salaries.post(obj);
        }
        this.$toastr.success("Record was updated");
        this.modelInput = {};
        this.loading = false;
        this.fetch();
      } catch (error) {
        this.$toastr.error(error);
        this.loading = false;
      }
    },
    async fetch(pager) {
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      try {
        var res = await this.$api.salaries.get(pager);
        var dt = res.data;
        this.data = dt.rows.map(x => x);

        // this.columns = this.columns.map(x => {
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
    },
    focus() {
      this.$refs.code.focus();
    },
    add() {
      this.modelInput = { id: 0, createdAt: new Date(), salaryLines: [] };
      this.focus();
    },
    rowClick(ev, row) {
      let t = this.data.find(x => x.id === row.id);
      if (!t) {
        throw "Could not find details record. Please refresh table";
      }
      this.modelInput = Object.assign({}, t);
      this.focus();
    },
    edit(id) {
      // let t = this.data.find(x => x.id === id);
      // if (!t) {
      //   throw "Could not find details record. Please refresh table";
      // }
      // this.modelInput = Object.assign({}, t);
      // this.focus();
    },
    async del(id) {
      // if (this.loading) return;
      // this.loading = true;
      // try {
      //   var res = await this.$api.users.delete(id);
      //   if (res.status < 300) {
      //     this.loading = false;
      //     this.fetch();
      //     this.$toastr.success("Record was deleted");
      //   }
      // } catch (e) {
      //   this.$toastr.error(e);
      //   this.loading = false;
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
.q-col-gutter-x-md > *,
.q-col-gutter-md > * {
  padding-left: unset;
}
.my-table th {
  text-align: left;
}
.my-table td {
  text-align: right;
}
.inline-flex {
  display: inline-flex;
}
td.selected {
  border-left: 4px solid var(--q-color-secondary);
}
</style>
