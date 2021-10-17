<template>
  <q-dialog v-model="model" persistent full-width full-height maximized>
    <q-card>
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title>
          Manage appointment types
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
            title="Appointment type list"
            :loading="loading"
            :data="data"
            :columns="columns"
            row-key="id"
            :pagination.sync="pager"
            :filter="filter"
            @refresh="refresh"
            @delete="del"
            @add="add"
            @edit="edit"
          >
            <template #body-cell-colorCode="props">
              <q-td>
                <q-badge
                  :style="{ backgroundColor: props.row.colorCode }"
                  :label="props.row.colorCode"
                />
              </q-td>
            </template>
          </my-table>
        </div>
        <div class="col-4 q-pa-sm">
          <q-card class="my-card">
            <q-toolbar>
              <q-toolbar-title>
                Add / Edit Appointment type
              </q-toolbar-title>
            </q-toolbar>
            <q-card-section>
              <q-form @submit="save">
                <q-input
                  ref="name"
                  v-model="modelInput.name"
                  name="name"
                  class=""
                  v-validate="'required|max:25'"
                  :error="errors.has('name')"
                  :error-message="errors.first('name')"
                  outlined
                  label="Name *"
                  autocomplete="off"
                  dense
                />

                <q-field
                  label="Badge color"
                  class="q-mb-lg"
                  stack-label
                  borderless
                >
                  <q-color
                    v-model="modelInput.colorCode"
                    no-footer
                    class="q-mt-xs q-ml-xs"
                  />
                </q-field>

                <q-btn
                  :loading="loading"
                  icon="las la-save"
                  label="Save"
                  title="Save"
                  text-color="white"
                  class="full-width"
                  color="secondary"
                  :disable="loading"
                  @click.stop="save"
                />
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import AppointmentType from "src/models/AppointmentType";
export default {
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  data() {
    return {
      modelInput: new AppointmentType(),
      loading: false,
      data: [],
      columns: [
        {
          name: "action",
          label: "Action",
          field: "action",
          width: "25px",
          align: "center"
        },
        {
          name: "name",
          label: "Name",
          field: "name",
          align: "left",
          sortable: true
        },
        {
          name: "colorCode",
          label: "Color",
          field: "colorCode",
          align: "left",
          sortable: true
        }
      ],
      pager: {
        page: 1,
        rowsPerPage: 25
      },
      filter: undefined
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async save() {
      if (!(await this.$validator.validate())) {
        return;
      }

      if (this.loading) return;
      this.loading = true;
      let res;
      try {
        if (this.modelInput.id > 0) {
          res = await this.$api.appointmentTypes.put(this.modelInput);
        } else {
          res = await this.$api.appointmentTypes.post(this.modelInput);
        }
        this.$toastr.success("Record was updated");
        this.loading = false;
        this.refresh();
      } catch (error) {
        this.loading = false;
        this.$toastr.error(error);
        throw error;
      }
    },
    refresh() {
      this.$store.commit("list/setAppointmentTypes", []);
      this.fetch(this.pager);
    },
    async fetch(pager) {
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      try {
        var res = await this.$api.appointmentTypes.get(pager);
        this.data = res.data;
        this.loading = false;
        return;

        // this.data = dt.rows.map(x => x);

        // this.columns = this.columns.map(x => {
        //   return Object.assign({}, x, {
        //     sortable: dt.sortColumns.indexOf(x.field.toLowerCase()) > -1
        //   });
        // });

        // // this.pager.rowsNumber = dt.rowsNumber;
        // this.pager.page = dt.page;
        // this.pager.sortBy = dt.sortBy;
        // this.pager.descending = dt.descending;
        // this.pager.rowsPerPage = dt.rowsPerPage;
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    },
    focus() {
      this.$refs.name.focus();
    },
    add() {
      this.modelInput = new AppointmentType();
      this.focus();
    },
    edit(id) {
      let t = this.data.find(x => x.id === id);
      if (!t) {
        throw "Could not find details record. Please refresh table";
      }
      this.modelInput = new AppointmentType(t);
      this.focus();
    },
    async del(id) {
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.appointmentTypes.delete(id);
        if (res.status < 300) {
          this.data = this.data.filter(val => val.id !== id);
          this.$toastr.success("Record was deleted");
        }
      } catch (e) {
        this.$toastr.error(e);
      }

      this.loading = false;
    }
  }
};
</script>
