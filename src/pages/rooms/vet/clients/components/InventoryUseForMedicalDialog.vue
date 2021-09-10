<template>
  <div>
    <q-dialog v-model="model" maximized>
      <q-card>
        <q-toolbar>
          <q-toolbar-title>
            Penggunaan inventory medis
          </q-toolbar-title>
          <q-btn
            icon="las la-plus"
            label="Tambah"
            size="sm"
            text-color="primary"
            flat
            @click="addInventoryUse"
          />
          <q-btn
            icon="las la-times"
            size="sm"
            text-color="grey"
            flat
            @click="model = false"
          />
        </q-toolbar>
        <q-card-section class="row full-width">
          <div class="col-3 q-pa-xs">
            <q-table
              flat
              bordered
              :columns="[
                {
                  name: 'label',
                  field: 'label',
                  label: 'Tanggal',
                  align: 'left'
                }
              ]"
              :data="dates"
            >
              <template #body-cell-label="props">
                <q-td
                  @click="selectedDate = props.row.label"
                  :class="[
                    props.row.label === selectedDate ? 'bg-grey text-white' : ''
                  ]"
                  class="cursor-pointer"
                >
                  {{ props.row.label }}
                </q-td>
              </template>
            </q-table>
          </div>
          <div class="col-9 q-pa-xs">
            <q-markup-table flat>
              <thead>
                <tr>
                  <th>
                    Nama item
                  </th>
                  <th>
                    Qty
                  </th>
                  <th>
                    Harga per unit
                  </th>
                  <th>
                    Total
                  </th>
                  <th>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in dataAtDates" :key="item.id">
                  <td>
                    {{ item.productName }}
                  </td>
                  <td>
                    {{ item.qty }}
                  </td>
                  <td>
                    {{ item.unitPrice | money }}
                  </td>
                  <td>
                    {{ item.lineTotal | money }}
                  </td>
                  <td class="text-right">
                    <template v-if="item.id < 1">
                      <q-btn
                        icon="las la-pencil-alt"
                        size="sm"
                        @click="editInventoryUse(item)"
                      />
                      <q-btn
                        icon="las la-trash"
                        size="sm"
                        text-color="negative"
                        @click="delInventoryUse(item.id)"
                      />
                    </template>
                  </td>
                </tr>
                <tr class="bg-grey text-white">
                  <td colspan="3" class="text-center">
                    TOTAL HARGA
                  </td>
                  <td>
                    {{ totalToday | money }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>

            <submit-button
              :isLoading="isLoading"
              v-show="dataAtDates.find(x => x.id < 1)"
              @click="submit"
              class="full-width q-mt-lg"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <AddInventoryUseDialog
      v-model="addDialog"
      :inventoryUseForMedical="inventoryUseModel"
      @update:inventory-use-for-medical="updateHandle"
    />
  </div>
</template>

<script>
import InventoryUseForMedical from "src/models/InventoryUseForMedical";
import AddInventoryUseDialog from "./AddInventoryUseDialog";
export default {
  name: "InventoryUseForMedicalDialog",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    clientId: {
      type: Number,
      required: true
    }
  },
  components: {
    AddInventoryUseDialog
  },
  data() {
    return {
      isLoading: false,
      data: [],
      formatDate: "ddd, DD MMM YY",
      selectedDate: undefined,
      addDialog: false,
      inventoryUseModel: new InventoryUseForMedical()
    };
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    dates() {
      var self = this;
      var m = !this.data.length
        ? []
        : this.data.reduce(function(a, b, arr) {
            if (
              !a.length ||
              !a.find(
                x =>
                  x.label ===
                  self.$util.formatDate(b.prescribedAt, self.formatDate)
              )
            ) {
              a.push({
                label: self.$util.formatDate(b.prescribedAt, "ddd, DD MMM YY"),
                value: b.prescribedAt
              });
            }
            return a;
          }, []);
      return m.sort((a, b) => (a.value > b.value ? 1 : -1));
    },
    dataAtDates() {
      return !this.data.length
        ? []
        : this.data.filter(
            x =>
              this.$util.formatDate(x.prescribedAt, this.formatDate) ===
              this.selectedDate
          );
    },
    totalToday() {
      return !this.dataAtDates.length
        ? 0
        : this.dataAtDates.reduce((a, b) => a + b.lineTotal, 0);
    }
  },
  methods: {
    async onRequest() {
      if (this.isLoading || this.clientId === 0) {
        return;
      }
      this.isLoading = true;
      try {
        var res = await this.$api.clients.getInventoryUseForMedical(
          this.clientId
        );
        // console.log('res.data', res.data)
        this.data = res.data.map(x => new InventoryUseForMedical(x));
        if (!this.selectedDate && this.data.length) {
          this.selectedDate = this.$util.formatDate(
            this.data[0].prescribedAt,
            this.formatDate
          );
        }
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
      this.isLoading = false;
    },
    addInventoryUse() {
      this.inventoryUseModel = new InventoryUseForMedical({
        id: this.data.length * -1
      });
      this.addDialog = true;
    },
    editInventoryUse(val) {
      this.inventoryUseModel = val;
      this.addDialog = true;
    },
    delInventoryUse(id) {
      this.data = this.data.filter(x => x.id !== id);
    },
    updateHandle(val) {
      if (!this.data.find(x => x.id === val.id)) {
        this.data.push(val);
      } else {
        this.data = this.data.map(x => (x.id === val.id ? val : x));
      }

      this.selectedDate = this.$util.formatDate(
        val.prescribedAt,
        this.formatDate
      );
    },
    async submit() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      try {
        var data = this.data
          .filter(x => x.id < 1)
          .map(x => Object.assign({}, x, { id: 0, clientId: this.clientId }));
        await this.$api.clients.postInventoryUseForMedical(data);
        this.$toastr.success("Data berhasil disimpan");
        this.isLoading = false;
        await this.onRequest();
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.onRequest();
  }
};
</script>
