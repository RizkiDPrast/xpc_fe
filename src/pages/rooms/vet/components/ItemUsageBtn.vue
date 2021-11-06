<template>
  <span>
    <q-btn v-bind="$attrs" @click="model = true">
      <slot></slot>
    </q-btn>
    <q-dialog v-model="model" persistent full-width full-height maximized>
      <q-card>
        <q-toolbar class="bg-secondary text-white">
          <q-toolbar-title>
            Manage Item Usage
            <span v-if="client.id">
              - {{ client.code }} {{ client.name }}
            </span>
            <span v-if="patient.id">
              :
              <patient-avatar
                :value="patient"
                v-if="patient.avatar && patient.avatar !== null"
              />
              {{ getAnimalTypeName(patient.animalTypeId) }} {{ patient.name }}
            </span>
          </q-toolbar-title>
          <q-btn
            flat
            round
            text-color="white"
            icon="las la-times"
            v-close-popup
          />
        </q-toolbar>
        <q-card-section class="row">
          <div class="col-8 q-pa-sm">
            <my-table
              title="Item usage list"
              :loading="loading"
              :data="data"
              :columns="columns"
              row-key="id"
              :pagination.sync="pager"
              :filter="filter"
              @refresh="refresh"
              @request="fetch"
              @add="add"
              @edit="edit"
            >
              <template #actions>
                <q-select
                  dense
                  outlined
                  style="min-width:100px"
                  label="Filter"
                  :options="['All', 'Transferred only', 'Not transferred only']"
                  v-model="transferred"
                />
              </template>
              <template #body-cell-action="props">
                <q-td align="center">
                  <q-btn
                    flat
                    round
                    icon="las la-eye"
                    @click="edit(props.row.id)"
                    color="warning"
                  />
                </q-td>
              </template>
              <template #body-cell-transferredToReceipt="props">
                <q-td align="center">
                  <q-checkbox :value="props.row.transferedToReceipt" readonly />
                  <q-tooltip
                    :content-class="
                      props.row.transferedToReceipt
                        ? 'bg-secondary'
                        : 'bg-negative'
                    "
                  >
                    This item has
                    <span v-if="!props.row.transferedToReceipt"> not </span>
                    been transferred to receipt
                  </q-tooltip>
                </q-td>
              </template>
            </my-table>
          </div>
          <div class="col-4 q-pa-sm">
            <q-card class="my-card">
              <q-toolbar>
                <q-toolbar-title>
                  Details Item Usage
                </q-toolbar-title>
              </q-toolbar>
              <q-card-section>
                <q-banner class="bg-warning text-grey-1">
                  <q-icon name="las la-exclamation-circle" /> Once saved it can
                  not be modified
                </q-banner>
              </q-card-section>
              <q-card-section>
                <q-form @submit="save">
                  <q-card-section>
                    <product-select
                      dense
                      outlined
                      label="Produk"
                      v-model="modelInput.productId"
                      name="productId"
                      @selectedChanged="productSelectChanged"
                      v-validate="''"
                      :error="errors.has('productId')"
                      :error-message="errors.first('productId')"
                      :disable="!!modelInput.id"
                    />
                    <q-input
                      ref="name"
                      dense
                      outlined
                      v-model="modelInput.itemName"
                      label="Item name"
                      name="itemName"
                      v-validate="'required'"
                      :error="errors.has('itemName')"
                      :error-message="errors.first('itemName')"
                      :disable="!!modelInput.id"
                    />
                    <div class="row q-col-gutter-sm">
                      <q-input
                        dense
                        outlined
                        type="number"
                        input-class="text-center"
                        class="col-4"
                        v-model="modelInput.qty"
                        label="Qty"
                        name="qty"
                        min="0"
                        step="0.05"
                        :max="
                          modelInput.trackInventory
                            ? modelInput.maxUnit
                            : 1000000
                        "
                        v-validate="
                          modelInput.product && modelInput.product !== null
                            ? 'required|min_value:0|max_value:' +
                              Math.floor(
                                (modelInput.trackInventory
                                  ? modelInput.maxUnit
                                  : 1000000) || 0
                              )
                            : 'required|min_value:0'
                        "
                        :error="errors.has('qty')"
                        :error-message="errors.first('qty')"
                        :disable="!!modelInput.id"
                      />
                      <unit-select
                        dense
                        outlined
                        name="unitId"
                        label="Unit"
                        class="col-8"
                        v-model="modelInput.unitId"
                        v-validate="'required'"
                        :error="errors.has('unitId')"
                        :error-message="errors.first('unitId')"
                        :include="availUnits"
                        :disable="!!modelInput.id"
                        @input="unitInput"
                        :hint="
                          !!modelInput.trackInventory
                            ? `max: ${modelInput.maxUnit} ${getUnitName(
                                modelInput.unitId
                              )}`
                            : ''
                        "
                      >
                      </unit-select>
                    </div>

                    <money-field
                      dense
                      outlined
                      label="Unit price"
                      v-model="modelInput.unitPrice"
                      name="unitPrice"
                      v-validate="'required|min_value:0'"
                      :error="errors.has('unitPrice')"
                      :error-message="errors.first('unitPrice')"
                      :disable="!!modelInput.id"
                    />

                    <q-field
                      dense
                      outlined
                      disable
                      class="full-width"
                      label="Total"
                      stack-label
                      name="total"
                      v-validate="''"
                      :error="errors.has('lineTotal')"
                      :error-message="errors.first('lineTotal')"
                    >
                      <template #control>
                        <div class="full-width text-right text-green text-h5">
                          {{ modelInput.lineTotal | money }}
                        </div>
                      </template>
                    </q-field>

                    <q-input
                      dense
                      outlined
                      input-class="text-center"
                      v-model="modelInput.category"
                      label="Category"
                      name="category"
                      v-validate="'max:50'"
                      :error="errors.has('category')"
                      :error-message="errors.first('category')"
                      hint="It can be used to group items in receipt"
                      :disable="!!modelInput.id"
                    />
                  </q-card-section>
                  <q-card-section>
                    <submit-button
                      :disable="!!modelInput.id"
                      :loading="loading"
                      class="full-width"
                      @submit="save"
                    />
                  </q-card-section>
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </span>
</template>

<script>
import ItemUsage from "src/models/ItemUsage";
import Patient from "src/models/Patient";
import Client from "src/models/Client";
export default {
  props: {
    clientId: {
      type: Number,
      default: () => 0
    },
    patientId: {
      type: Number,
      default: () => 0
    }
  },
  computed: {},
  data() {
    return {
      loading: false,
      model: false,
      data: [],
      modelInput: new ItemUsage(),
      columns: [
        {
          name: "action",
          label: "Action",
          field: "action",
          width: "25px",
          align: "center"
        },
        {
          name: "createdat",
          label: "Created at",
          field: "createdAt",
          align: "left",
          sortable: true,
          format: val => this.$util.toDateString(val)
        },
        {
          name: "itemname",
          label: "Item name",
          field: "itemName",
          align: "left",
          sortable: true
        },
        {
          name: "qty",
          label: "Qty",
          field: "qty",
          align: "right",
          sortable: true
        },
        {
          name: "unitId",
          label: "Unit",
          field: "unitId",
          format: val => this.getUnitName(val),
          sortable: true
        },
        {
          name: "unitPrice",
          label: "Unit price",
          field: "unitPrice",
          align: "right",
          format: val => this.$options.filters.money(val)
        },
        {
          name: "linetotal",
          label: "Total",
          field: "lineTotal",
          align: "right",
          format: val => this.$options.filters.money(val)
        },
        {
          name: "category",
          label: "Category",
          field: "category",
          align: "left",
          sortable: true
        },
        {
          name: "transferredToReceipt",
          label: "Transferred",
          field: "transferredToReceipt",
          align: "left",
          sortable: true
        }
      ],
      pager: {
        page: 1,
        rowsPerPage: 25,
        sortBy: "createdat",
        descending: true
      },
      filter: undefined,
      transferred: "All",
      availUnits: [],
      loadingClient: false,
      client: {},
      patient: {}
    };
  },
  mounted() {
    this.fetch();
    this.fetchClient();
  },
  watch: {
    transferred() {
      this.fetch();
    },
    patientId() {
      this.fetchClient();
    }
  },
  methods: {
    unitInput(unitId) {
      console.log("this.modelInput.product", unitId, this.modelInput?.product);

      if (this.modelInput.product && this.modelInput.product !== null) {
        if (unitId === this.modelInput.product.unitId) {
          // base unit
          this.modelInput.maxUnit = this.modelInput.product.qty;
          this.modelInput.qty = 1;

          this.modelInput.unitPrice = this.modelInput.product.sellingPriceWithoutDisc;
          this.modelInput.moneyDiscount = this.modelInput.product.discount;
          this.modelInput.percentDiscount = this.modelInput.product.discountPercent;

          this.modelInput.unitId = this.modelInput.product.unitId;
          this.modelInput.unitName = this.modelInput.product.unitName;
        } else {
          //subunits
          if (this.modelInput.product.productUnits) {
            var subunit = this.modelInput.product.productUnits.find(
              x => x.unitId === unitId
            );
            if (!subunit) {
              this.$toastr.error(
                "Subunit was not found. Please check product details"
              );
              return;
            }
            this.modelInput.maxUnit = parseInt(
              Math.floor(
                this.modelInput.product.qty / subunit.toBaseMultiplier
              ),
              10
            );
            this.modelInput.qty = 1;
            this.modelInput.unitPrice = subunit.unitPrice;
            this.modelInput.moneyDiscount = 0;
            this.modelInput.percentDiscount = 0;

            this.modelInput.unitId = subunit.unitId;
            this.modelInput.unitName = subunit.unitName;
          }
        }
      }
    },
    productSelectChanged(val) {
      if (val.unitId >= 0) {
        this.modelInput.product = val;
        this.modelInput.itemName = val.label;
        this.modelInput.maxUnit = val.qty;
        this.modelInput.category = val.categoryName;
        this.modelInput.unitId = val.unitId;
        this.modelInput.unitPrice = val.sellingPrice;
        this.modelInput.trackInventory = val.trackInventory;
      } else {
        this.modelInput.product = {};
        this.modelInput.maxUnit = 0;
        this.modelInput.category = undefined;
        this.modelInput.unitId = null;
        val.unitId = null;
        this.modelInput.unitPrice = 0;
        this.modelInput.trackInventory = false;
      }

      if (Array.isArray(val.productUnits)) {
        this.availUnits = val.productUnits.map(x => x.unitId);
        this.availUnits.unshift(val.unitId);
      } else {
        this.availUnits = [val.unitId];
      }
    },
    async save() {
      if (this.modelInput.id) {
        this.$toastr.warning("Modifying form is not allowed");
        return;
      }
      if (!(await this.$validator.validate())) {
        return;
      }

      if (this.loading) return;
      this.loading = true;
      let res;
      try {
        this.modelInput.clientId = this.clientId || this.client.id;
        this.modelInput.patientId = this.patientId || undefined;
        this.modelInput.qty = Number(this.modelInput.qty);

        res = await this.$api.itemUsages.post(this.modelInput);

        this.$toastr.success("Record was updated");
        this.loading = false;

        this.add();
        this.fetch();
      } catch (error) {
        this.loading = false;
        this.$toastr.error(error);
        throw error;
      }
    },
    refresh() {
      this.$store.commit("list/setCategories", []);
      this.fetch(this.pager);
    },
    async fetchClient() {
      if (!this.patientId && !this.clientId) return;

      if (this.loadingClient) return;
      this.loadingClient = true;
      try {
        let res;
        if (this.patientId) {
          res = await this.$api.patients.getOne(this.patientId);
          this.patient = new Patient(res.data);
          this.client = new Client(res.data.client);
        } else {
          res = await this.$api.clients.getOne(this.clientId);
          this.client = new Client(res.data);
        }
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loadingClient = false;
    },
    async fetch(pager) {
      if (!this.clientId && !this.patientId) return;

      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      if (this.transferred !== "All") {
        if (this.transferred === "Transferred only") {
          pager.transferred = true;
        } else {
          pager.transferred = false;
        }
      }

      try {
        let res;
        if (this.patientId) {
          res = await this.$api.itemUsages.getByPatient(this.patientId, pager);
        } else {
          res = await this.$api.itemUsages.getByClient(this.clientId, pager);
        }
        var dt = res.data;

        this.data = dt.rows.map(x => new ItemUsage(x));

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
    focus() {
      this.$refs.name.focus();
    },
    add() {
      this.modelInput = new ItemUsage();
      this.availUnits = [];
      this.focus();
    },
    edit(id) {
      let t = this.data.find(x => x.id === id);
      if (!t) {
        throw "Could not find details record. Please refresh table";
      }
      this.modelInput = new ItemUsage(t);
    }
  }
};
</script>
