<template>
  <q-dialog v-model="model" full-width full-height>
    <q-card>
      <dialog-header class="bg-secondary text-white" title="Manage suppliers" />
      <q-scroll-area class="full-width" style="height: calc(100vh - 100px);">
        <q-card-section class="row">
          <div class="col-8 q-pa-sm">
            <my-table
              title="Supplier list"
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
            </my-table>
          </div>
          <div class="col-4 q-pa-sm">
            <q-card class="my-card">
              <q-toolbar>
                <q-toolbar-title>
                  Add / Edit Supplier
                </q-toolbar-title>
              </q-toolbar>
              <q-card-section>
                <q-form @submit="save" class="q-col-gutter-md full-width">
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
                    v-model="modelInput.phones"
                    name="phones"
                    class=""
                    v-validate=""
                    :error="errors.has('phones')"
                    :error-message="errors.first('phones')"
                    outlined
                    label="Phones"
                    autocomplete="off"
                    dense
                  />

                  <q-input
                    v-model="modelInput.email"
                    clearable
                    name="email"
                    class=""
                    v-validate="'email'"
                    :error="errors.has('email')"
                    :error-message="errors.first('email')"
                    outlined
                    label="Email"
                    autocomplete="off"
                    dense
                  />

                  <q-input
                    type="textarea"
                    rows="3"
                    label="Address"
                    name="address"
                    v-model="modelInput.address"
                    v-validate="''"
                    :error="errors.has('address')"
                    :error-message="errors.first('address')"
                    class="q-pa-sm col-md-6 col-sm-12"
                    dense
                    outlined
                  />

                  <q-input
                    type="textarea"
                    rows="3"
                    label="Notes"
                    name="notes"
                    v-model="modelInput.notes"
                    v-validate="''"
                    :error="errors.has('notes')"
                    :error-message="errors.first('notes')"
                    class="q-pa-sm col-md-6 col-sm-12"
                    dense
                    outlined
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
</template>

<script>
import Supplier from "src/models/Supplier";
export default {
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  components: {},
  data() {
    return {
      loading: false,
      data: [],
      file: null,
      modelInput: {},
      columns: [
        {
          name: "action",
          label: "action",
          field: "action",
          width: "25px",
          align: "center"
        },
        {
          name: "id",
          label: "#",
          field: "id",
          align: "left",
          format: (val, row) => this.data.indexOf(row) + 1
        },
        {
          name: "name",
          label: "Name",
          field: "name",
          align: "left"
        },
        {
          name: "phones",
          label: "Phones",
          field: "phones",
          align: "left"
        },
        {
          name: "email",
          label: "Email",
          field: "email",
          align: "left"
        },
        {
          name: "address",
          label: "Address",
          field: "address",
          align: "left"
        }
      ],
      pager: {
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0
      },
      filter: undefined
    };
  },
  mounted() {
    this.fetch();
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
  watch: {},
  methods: {
    async save() {
      if (!(await this.$validator.validate())) {
        return;
      }

      if (this.loading) return;
      this.loading = true;
      let res;

      if (this.modelInput.email && this.modelInput.email.trim() === "") {
        this.modelInput.email = undefined;
      }
      try {
        if (this.modelInput.id) {
          res = await this.$api.suppliers.put(this.modelInput);
        } else {
          res = await this.$api.suppliers.post(this.modelInput);
        }
        this.$toastr.success("Record was updated");
        this.modelInput = {};
        this.loading = false;
        this.fetch();
      } catch (error) {
        this.loading = false;
        this.$toastr.error(error);
        throw error;
      }
    },
    async fetch(pager) {
      console.log("fetching", this.loading);
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      try {
        pager.date = this.dateModel;
        var res = await this.$api.suppliers.get(pager);
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
    focus() {
      this.$refs.name.focus();
    },
    add() {
      this.modelInput = {};
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
        var res = await this.$api.suppliers.delete(id);
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
