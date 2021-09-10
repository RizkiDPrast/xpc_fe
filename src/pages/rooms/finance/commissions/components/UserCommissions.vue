<template>
  <div class="row q-mt-xl">
    <div class="col-sm-12 col-md-2 q-pa-sm">
      <q-card>
        <q-toolbar>
          <q-toolbar-title>
            Select month
          </q-toolbar-title>
        </q-toolbar>
        <my-table
          :loading="loading"
          :data="data"
          :columns="columns"
          row-key="id"
          :pagination.sync="pager"
          :filter="filter"
          @refresh="fetchT1"
          searchOnly
        >
          <template #body-cell-label="props">
            <q-td
              class="cursor-pointer text-center"
              :class="{ selected: selected && props.row.id === selected.id }"
              @click="selected = props.row"
            >
              {{ props.row.label }}
            </q-td>
          </template>
        </my-table>
      </q-card>
    </div>
    <div class="col-sm-12 col-md-10 q-pa-sm">
      <q-card v-if="selected && user" class="q-pt-lg">
        <q-toolbar>
          <q-toolbar-title class="text-center">
            <p>
              {{
                `Commission Report for ${user.displayName ||
                  user.userName}`.toUpperCase()
              }}
            </p>
            <p>{{ selected.label.toUpperCase() }}</p>
          </q-toolbar-title>
        </q-toolbar>

        <q-markup-table flat>
          <tr>
            <th>Date</th>
            <th v-for="item in types" :key="item.id">{{ item.code }}</th>
          </tr>
          <tr v-for="date in dates" :key="date.toString()">
            <td class="text-center">
              {{ $util.formatDate(date, "DD-MM-YYYY") }}
            </td>
            <td class="text-center" v-for="type in types" :key="type.id">
              <!-- {{ getValue(date, type.code) }} -->
              <q-input
                dense
                outlined
                type="number"
                min="0"
                step="0.5"
                :value="getValue(date, type.code)"
              >
                <q-popup-edit
                  v-model="
                    model[
                      `${$util.formatDate(date, 'YYYY-MM-DD')}-${type.code}`
                    ]
                  "
                  title="Update value"
                >
                  <q-input
                    dense
                    outlined
                    v-model="
                      model[
                        `${$util.formatDate(date, 'YYYY-MM-DD')}-${type.code}`
                      ]
                    "
                    autofocus
                  />
                </q-popup-edit>
              </q-input>
            </td>
          </tr>
        </q-markup-table>
      </q-card>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => undefined
    }
  },
  data() {
    return {
      loading: false,
      filter: undefined,
      data: [],
      columns: [
        {
          name: "label",
          label: "Year Month",
          field: "label",
          align: "center"
        }
      ],
      pager: {
        rowsPerPage: 15
      },
      selected: undefined,
      dates: [],
      types: [],
      values: [],
      model: {}
    };
  },
  watch: {
    "user.id"(val) {
      this.fetchT1();
    },
    "selected.id"(val) {
      this.fetchT2();
    }
  },
  methods: {
    async fetchT1() {
      if (!this.user || !this.user.id) return;
      if (this.loading) return;
      this.loading = true;
      this.selected = undefined;
      try {
        let res = await this.$api.commissions.getMonthsByUser(this.user.id);
        this.data = res.data;
      } catch (e) {
        this.toastr.error(e);
      }
      this.loading = false;
    },
    async fetchT2() {
      if (!this.user || !this.user.id || !this.selected || !this.selected.id)
        return;
      if (this.loading) return;
      this.loading = true;
      this.dates = [];
      this.types = [];
      this.values = [];
      try {
        let res = await this.$api.commissions.getByUser(
          this.user.id,
          this.selected.id
        );
        var data = res.data;
        this.types = data.types;
        this.values = data.values;
        var d1 = new Date(data.d1);
        var d2 = new Date(data.d2);
        var dates = [d1];
        var i = 0;
        while (true) {
          if (i++ > 35) {
            throw "stack overflow";
          }
          if (d1 >= d2) {
            break;
          }
          d1 = this.$util.addToDate(d1, { days: 1 });
          dates.push(d1);
        }
        this.dates = dates;
      } catch (e) {
        this.toastr.error(e);
      }
      this.loading = false;
    },
    getValue(date, type) {
      if (!this.values.length) return 0;
      let v = this.values.find(
        x =>
          x.type === type && this.$util.getDateDiff(date, x.date, "days") === 0
      );
      if (v) return v.value;
      return 0;
    }
  }
};
</script>
<style lang="scss" scoped>
.selected {
  background-color: rgba(0, 0, 0, 0.03) !important;
}
</style>
