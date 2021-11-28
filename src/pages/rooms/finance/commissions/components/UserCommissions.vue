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
              <q-badge v-if="props.row.locked" color="negative" class="q-mr-lg">
                <q-icon name="las la-lock" />
              </q-badge>
              {{ props.row.label }}
            </q-td>
          </template>
        </my-table>
      </q-card>
    </div>
    <div class="col-sm-12 col-md-7 q-pa-sm">
      <q-card v-if="selected && user" class="q-pt-lg">
        <q-badge v-if="selected.locked" color="negative" class="q-mr-lg">
          <q-icon name="las la-lock" class="q-mr-sm" /> Locked
        </q-badge>
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

        <q-markup-table flat dense>
          <tr>
            <th>Date</th>
            <th v-for="item in types" :key="item.code">{{ item.code }}</th>
          </tr>
          <tr v-for="date in dates" :key="date.toString()">
            <td class="text-center">
              {{ $util.formatDate(date, "DD-MM-YYYY") }}
            </td>
            <td class="text-center" v-for="type in types" :key="type.id">
              <q-input
                dense
                outlined
                type="number"
                min="0"
                step="0.5"
                :value="getValue(date, type.code)"
                @input="val => setValue(val, date, type.code)"
                debounce="500"
                bottom-slots
                :disable="selected.locked"
              >
                <template #hint v-if="getMoneyPerValue(date, type.code) > 0">
                  <div>
                    {{ getMoneyPerValue(date, type.code) | money }}/ point
                  </div>
                </template>
                <!-- <template #hint>
                  <div v-if="!checkLocked(date, type.code)">
                    <q-badge color="negative">
                      unclosed
                    </q-badge>
                  </div>
                </template> -->
                <!-- <q-popup-edit
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
                </q-popup-edit> -->
              </q-input>
            </td>
          </tr>
        </q-markup-table>
      </q-card>
    </div>

    <div class="col-sm-12 col-md-3 q-pa-sm">
      <q-card v-if="selected && user">
        <q-toolbar>
          <q-toolbar-title> Summary for {{ selected.label }} </q-toolbar-title>
        </q-toolbar>
        <q-card-section>
          <q-markup-table flat dense>
            <tr>
              <th>Type</th>
              <th class="text-right">Total Point</th>
              <th class="text-right">Rp per Point</th>
              <th class="text-right">Total</th>
            </tr>
            <tr v-for="item in types" :key="item.code">
              <td>{{ item.code }}</td>
              <td class="text-right">
                {{
                  values.reduce((a, b) => {
                    if (b.type === item.code) {
                      return a + b.value;
                    }
                    return a;
                  }, 0)
                }}
              </td>
              <td class="text-right">
                <span v-if="item.moneyPerValueArr">
                  {{
                    item.moneyPerValueArr
                      .map(x => x.toLocaleString("id"))
                      .join(" | ")
                  }}
                </span>
              </td>
              <td class="text-right">
                {{
                  values.reduce((a, b) => {
                    if (b.type === item.code) {
                      return a + b.value * b.moneyPerValue;
                    }
                    return a;
                  }, 0) | money
                }}
              </td>
            </tr>
            <tr class="bg-grey-3 text-bold">
              <td colspan="3" class="text-center">Grand Total</td>
              <td class="text-right">
                {{
                  values.reduce((a, b) => a + b.value * b.moneyPerValue, 0)
                    | money
                }}
              </td>
            </tr>
          </q-markup-table>
        </q-card-section>
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
      updating: false
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
  mounted() {
    this.fetchT1();
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
        this.values = data.values;

        //we combine config types with any recorded types
        // to prevent types from previous report not visible
        //TODO: check with different case
        let types = [];
        if (this.values.length) {
          types = this.values.reduce((a, b) => {
            var exists = a.find(x => x.code === b.type);
            if (exists) {
              let mpv = b.moneyPerValue;
              if (exists.moneyPerValueArr.indexOf(mpv) === -1) {
                exists.moneyPerValueArr.push(mpv);
              }
              return a;
            }
            a.push({
              code: b.type,
              moneyPerValueArr: [b.moneyPerValue],
              description: ""
            });
            return a;
          }, []);
        }
        if (data.types.length) {
          for (let ty of data.types) {
            let o = types.find(x => x.code === ty.code);
            if (o) {
              o.description = ty.description;
              continue;
            }
            types.push(ty);
          }
        }

        //sorting here
        types = types.sort((a, b) => (a.code > b.code ? 1 : -1));

        this.types = types;

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
        this.$toastr.error(e);
      }
      this.loading = false;
    },
    checkLocked(date, type) {
      if (!this.values.length) return "NA";
      let v = this.values.find(
        x =>
          x.type === type && this.$util.getDateDiff(date, x.date, "days") === 0
      );
      if (v && v.lockedAt && v.lockedAt !== null) return true;
      return false;
    },
    getMoneyPerValue(date, type) {
      if (!this.values.length) return 0;
      let v = this.values.find(
        x =>
          x.type === type && this.$util.getDateDiff(date, x.date, "days") === 0
      );
      if (v) return v.moneyPerValue;
      return 0;
    },
    getValue(date, type) {
      if (!this.values.length) return 0;
      let v = this.values.find(
        x =>
          x.type === type && this.$util.getDateDiff(date, x.date, "days") === 0
      );
      if (v) return v.value;
      return 0;
    },
    async setValue(val, date, type) {
      if (isNaN(val)) return;
      if (this.updating) return;
      this.updating = true;
      try {
        let res = await this.$api.commissions.post({
          userId: this.user.id,
          type,
          yearMonth: this.$util.formatDate(date, "YYYY-MM"),
          date,
          value: Number(val),
          moneyPerValue: type.moneyPerValue
        });
        console.log(res.data);
        var exists = this.values.find(
          x =>
            x.type === res.data.type &&
            new Date(x.date).toDateString() ===
              new Date(res.data.date).toDateString()
        );
        console.log(exists);
        if (exists) {
          exists.value = res.data.value;
          console.log("ok", exists);
        } else {
          this.values.push(res.data);
        }
        this.$toastr.success("Value was updated");
      } catch (error) {
        this.$toastr.error(error);
      }
      this.updating = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.selected {
  background-color: rgba(0, 0, 0, 0.03) !important;
}
</style>
