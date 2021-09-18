<template>
<div v-if="client.id">
  <q-btn v-bind="$attrs" @click="model = true">
  <slot>
  </slot>
          <q-tooltip content-class="bg-secondary">
            Client's Appointments
          </q-tooltip>
  </q-btn>
  <q-dialog v-model="model" full-width full-height>
    <q-card>
      <dialog-header
        class="bg-secondary text-white"
        :title="`Manage appointments for ${client.code} - ${client.name}`"
      />
      <q-scroll-area class="full-width" style="height: calc(100vh - 100px);">
        <q-card-section class="row">
          <div class="col-8 q-pa-sm">
            <my-table
              :title="title || 'Appointment list'"
              :loading="loading"
              :data="data"
              :columns="columns"
              row-key="id"
              :pagination.sync="pager"
              :filter="filter"
              @request="fetch"
              @delete="del"
              @add="add"
              @edit="edit"
            >
            <template #actions>
              <q-checkbox label="Include past appointments"
                v-model="showPast"
                outlined
              />
            </template>
              <template #body-cell-waPhone="props">
                <q-td>
                  <wa-btn :value="props.row.waPhone" />
                </q-td>
              </template>
              <template #body-cell-confirmedByClient="props">
                <q-td>
                  <q-badge
                    :color="
                      props.row.confirmedByClient ? 'positive' : 'negative'
                    "
                    :label="props.row.confirmedByClient ? 'Yes' : 'No'"
                  />
                </q-td>
              </template>
              <template #body-cell-appointmentTypeId="props">
                <q-td>
                  <q-badge
                    :style="{
                      backgroundColor: getAppointment(
                        props.row.appointmentTypeId
                      ).colorCode
                    }"
                    :label="getAppointment(props.row.appointmentTypeId).name"
                  />
                </q-td>
              </template>
            </my-table>
          </div>
          <div class="col-4 q-pa-sm">
            <q-card class="my-card">
              <q-toolbar>
                <q-toolbar-title>
                  Add / Edit Appointment
                </q-toolbar-title>
              </q-toolbar>
              <q-card-section>
                <q-form @submit="save" class="q-col-gutter-md full-width">
                  <appointment-type-select
                    v-model="modelInput.appointmentTypeId"
                    label="Appointment type *"
                    dense
                    outlined
                    name="AppointmentType"
                    v-validate="'required'"
                    :error="errors.has('AppointmentType')"
                    :error-message="errors.first('AppointmentType')"
                  />
                  <client-select
                    readonly
                    ref="cselect"
                    :value="modelInput.clientId"
                    @selected="selectedClientChange"
                    label="Client"
                    hint="Leave empty if not for registered client"
                    dense
                    outlined
                  />
                  <q-input
                    ref="name"
                    v-model="modelInput.name"
                    name="name"
                    class=""
                    v-validate="'required|max:50'"
                    :error="errors.has('name')"
                    :error-message="errors.first('name')"
                    outlined
                    label="Name *"
                    autocomplete="off"
                    dense
                  />

                  <q-input
                    v-model="modelInput.waPhone"
                    name="waPhone"
                    class=""
                    v-validate="'numeric'"
                    :error="errors.has('waPhone')"
                    :error-message="errors.first('waPhone')"
                    outlined
                    label="WA phone"
                    autocomplete="off"
                    dense
                  />

                  <q-input
                    v-model="modelInput.otherPhones"
                    name="phones"
                    class=""
                    v-validate=""
                    :error="errors.has('phones')"
                    :error-message="errors.first('phones')"
                    outlined
                    label="Other Phones"
                    autocomplete="off"
                    dense
                  />

                  <date-input
                    label="Due date *"
                    v-model="modelInput.dueDate"
                    name="dueDate"
                    v-validate="'required'"
                    :error="errors.has('dueDate')"
                    :error-message="errors.first('dueDate')"
                    class="q-pa-sm col-md-6 col-sm-12"
                    dense
                    :maxToday="false"
                  />

                  <q-input
                    label="Note *"
                    name="for"
                    v-model="modelInput.note"
                    v-validate="'required'"
                    :error="errors.has('for')"
                    :error-message="errors.first('for')"
                    class="q-pa-sm col-md-6 col-sm-12"
                    dense
                    outlined
                    autogrow
                    count
                  />

                  <q-toggle
                    v-if="modelInput && modelInput.id > 0"
                    label="Confirmed by client?"
                    name="isConfirmed"
                    v-model="modelInput.confirmedByClient"
                    :error="errors.has('isConfirmed')"
                    :error-message="errors.first('isConfirmed')"
                    class="q-pa-sm col-md-6 col-sm-12"
                    dense
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
                  />
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-scroll-area>
    </q-card>
  </q-dialog>
</div>
</template>

<script>
import AppointmentTypeSelect from "./AppointmentTypeSelect";
export default {
  name:"ClientAppointmentBtn",
  props: {   
    date: {
      type: Date,
      default: () => undefined
    },
    client: {
      type: Object,
      required: true,
    }
  },
  components: {
    AppointmentTypeSelect
  },
  data() {
    return {
      loading: false,
      data: [],
      d1: (new Date()).setDate((new Date).getDate() - 1),
      file: null,
      modelInput: {
        clientId: this.client.id,
        name: this.client.name,
        waPhone: this.client.waPhone,
        otherPhones: this.client.otherPhones,
      },
      columns: [
        {
          name: "action",
          label: "action",
          field: "action",
          width: "25px",
          align: "center",
        },
        {
          name: "appointmentTypeId",
          label: "Type",
          field: "appointmentTypeId",
          align: "left"
        },
        {
          name: "name",
          label: "Name",
          field: "name",
          align: "left"
        },
        {
          name: "waPhone",
          label: "WaPhone",
          field: "waPhone",
          align: "left"
        },
        {
          name: "otherPhones",
          label: "Other phones",
          field: "otherPhones",
          align: "left"
        },
        {
          name: "dueDate",
          label: "Due date",
          field: "dueDate",
          align: "left",
          format: val => this.$util.toDateString(val),
          classes: (row)=> new Date(row.dueDate) < new Date(this.d1) ? 'bg-grey-3 text-grey' : 'text-secondary'
        },
        {
          name: "note",
          label: "Note",
          field: "note",
          align: "left"
        },
      ],
      pager: {
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0,
        sortBy: 'dueDate',
        descending: false,
      },
      filter: undefined,
      model:false,
      showPast: false
    };
  },
  mounted() {
     console.log('this.client',this.client)
    this.fetch();
  },
  computed: {
    title() {
      if (!this.dateModel || this.dateModel === null) {
        return "Appointment list";
      }
      return `Appointments @${this.$util.toDateString(this.dateModel)}`;
    },   
    dateModel: {
      get() {
        return this.date;
      },
      set(val) {
        this.$emit("update:date", val);
      }
    }
  },
  watch: {
    date(val) {
      this.modelInput.dueDate = new Date(val);
      this.fetch();
    },
    client(val){
      console.log('val',val)
      this.modelInput.clientId = val.id
      this.modelInput.name = this.client.name,
      this.modelInput.otherPhones = val.otherPhones
      this.modelInput.waPhone = val.waPhone

      this.fetch()
    },
    showPast(){
      this.fetch()
    }
  },
  methods: {
    async save() {
      if (!(await this.$validator.validate())) {
        this.$toastr.error('Please fix all errors')
        return;
      }

      if (this.loading) return;
      this.loading = true;

      this.modelInput.clientId = this.client.id;
      let res;
      try {
        if (this.modelInput.id) {
          res = await this.$api.appointments.put(this.modelInput);
        } else {
          res = await this.$api.appointments.post(this.modelInput);
        }
        this.$toastr.success("Record was updated");
        this.dateModel = new Date(this.modelInput.dueDate);
        this.modelInput = {};
        this.loading = false;
        this.fetch();

        this.$emit("update");
      } catch (error) {
        this.loading = false;
        this.$toastr.error(error);
        throw error;
      }
    },
    selectedClientChange(client) {
      if (client == null) {
        this.modelInput = Object.assign({}, this.modelInput, new Client());
      } else {
        this.modelInput = Object.assign({}, this.modelInput, {
          name: client.name,
          waPhone: client.waPhone,
          otherPhones: client.otherPhones
        });
      }
      // console.log("modelInput", this.modelInput);
    },
    async fetch(pager) {
      // console.log("fetching", this.loading);
      if(!this.client.id) return;
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      try {
        pager.date = this.dateModel;
        pager.clientId = this.client.id;

        if(this.showPast){
          pager.showPast = true
        } else {
          pager.showPast = undefined
        }

        var res = await this.$api.appointments.getByClient(pager);
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
      this.$refs.name.focus();
    },
    add() {
      this.modelInput = {
        clientId: this.client.id,
        name: this.client.name,
        waPhone: this.client.waPhone,
        otherPhones: this.client.otherPhones
      };
      this.focus();
    },
    edit(id) {
      let t = this.data.find(x => x.id === id);
      if (!t) {
        throw "Could not find details record. Please refresh table";
      }
      this.modelInput = Object.assign({}, t);
      this.focus();
    },
    async del(id) {
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.appointments.delete(id);
        if (res.status < 300) {
          this.loading = false;
          this.fetch();
          this.$toastr.success("Record was deleted");
        }
      } catch (e) {
        this.$toastr.error(e);
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.q-col-gutter-x-md > *,
.q-col-gutter-md > * {
  padding-left: unset;
}
</style>
