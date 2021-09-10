<template>
  <div>
    <q-btn
      icon="las la-paw"
      @click="modal = true"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <q-tooltip content-class="bg-secondary">
        Manage animal types
      </q-tooltip>
    </q-btn>

    <q-dialog v-model="modal" persistent full-width full-height maximized>
      <q-card>
        <q-toolbar class="bg-secondary text-white">
          <q-toolbar-title>
            Manage animal types
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
              title="Animal type list"
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
            </my-table>
          </div>
          <div class="col-4 q-pa-sm">
            <q-card class="my-card">
              <q-toolbar>
                <q-toolbar-title>
                  Add / Edit
                </q-toolbar-title>
              </q-toolbar>
              <q-card-section>
                <q-form @submit="save">
                  <q-input
                    ref="typeName"
                    v-model="type.name"
                    name="name"
                    class=""
                    v-validate="'required|max:25'"
                    :error="errors.has('name')"
                    :error-message="errors.first('name')"
                    outlined
                    label="Animal type name *"
                    autocomplete="off"
                    dense
                  />

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
  </div>
</template>

<script>
import AnimalType from "src/models/AnimalType";
export default {
  props: {},
  computed: {},
  data() {
    return {
      modal: false,
      type: new AnimalType(),
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
          name: "modifiedat",
          label: "Last Modified At",
          field: "modifiedAt",
          align: "left",
          sortable: true,
          format: val => this.$util.toDateString(val)
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
        if (this.type.id > 0) {
          res = await this.$api.animalTypes.put(this.type);
        } else {
          res = await this.$api.animalTypes.post(this.type);
        }
        this.$toastr.success("Record was updated");
        this.loading = false;
        this.fetch();
      } catch (error) {
        this.loading = false;
        this.$toastr.error(error);
      }
    },
    refresh() {
      this.$store.commit("list/setAnimalTypes", []);
      this.fetch(this.pager);
    },
    async fetch(pager) {
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      try {
        var res = await this.$api.animalTypes.get(pager);
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
      this.$refs.typeName.focus();
    },
    add() {
      this.type = new AnimalType();
      this.focus();
    },
    edit(id) {
      let t = this.data.find(x => x.id === id);
      if (!t) {
        throw "Could not find details record. Please refresh table";
      }
      this.type = new AnimalType(t);
      this.focus();
    },
    async del(id) {
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.animalTypes.delete(id);
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
