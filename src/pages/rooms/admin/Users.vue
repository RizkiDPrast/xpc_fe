<template>
  <q-page>
    <page-header />
    <q-card-section class="row">
      <div class="col-8 q-pa-sm">
        <my-table
          title="User list"
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
          <template #body-cell-avatar="props">
            <q-td>
              <user-avatar :value="props.row" size="sm" />
            </q-td>
          </template>
          <template #body-cell-blockUser="props">
            <q-td>
              <q-btn flat round size="sm" icon="las la-lock" 
                v-if="props.row.lockoutEnabled && props.row.lockoutEnd != null"
                @click="removeLockout(props.row.id)"
                :loading="removingLockout"
                color="negative"
              >
              <q-tooltip content-class="bg-negative">
                This user is being locked until {{$util.formatDate(props.row.lockoutEnd, 'DD MMMM YYYY HH:mm:ss  WIB')}}
                <p> click to remove the lock out now </p> 
              </q-tooltip>
              </q-btn>
              <q-badge
                v-if="!props.row.blockUser"
                color="positive"
                label="Active"
              />
              <q-badge v-else color="grey-5" label="Inactive" />
            </q-td>
          </template>
        </my-table>
      </div>
      <div class="col-4 q-pa-sm">
        <q-card class="my-card">
          <q-toolbar>
            <q-toolbar-title>
              Add / Edit User
            </q-toolbar-title>
          </q-toolbar>
          <q-card-section>
            <q-form @submit="save" class="q-col-gutter-md full-width">
              <div
                v-if="
                  modelInput.avatar &&
                    modelInput.avatar != null &&
                    modelInput.avatar.fileUri
                "
                class="full-width flex-center"
              >
                <q-avatar>
                  <q-img :src="modelInput.avatar.fileUri" />
                </q-avatar>
              </div>

              <my-file-input
                v-model="modelInput.file"
                outlined
                dense
                name="file"
                label="Avatar"
                accept="image/*"
                :max-file-size="1 * 1024 * 1024"
                clearable
                hint="Image file with maximum size of 1 MB"
              />

              <q-input
                ref="name"
                v-model="modelInput.userName"
                name="name"
                class=""
                v-validate="'required|max:25|alpha_num'"
                :error="errors.has('name')"
                :error-message="errors.first('name')"
                outlined
                label="UserName *"
                autocomplete="off"
                dense
              />

              <q-input
                ref="email"
                v-model="modelInput.email"
                name="email"
                class=""
                v-validate="'required|email'"
                :error="errors.has('email')"
                :error-message="errors.first('email')"
                outlined
                label="Email *"
                autocomplete="off"
                dense
              />

              <q-input
                v-model="modelInput.displayName"
                name="displayName"
                class=""
                v-validate="'required|max:50'"
                :error="errors.has('displayName')"
                :error-message="errors.first('displayName')"
                outlined
                label="Display Name *"
                autocomplete="off"
                dense
              />

              <q-select
                v-model="modelInput.roleName"
                :options="roles"
                label="Role"
                dense
                outlined
                autocomplete="off"
              />

              <q-input
                clearable
                v-if="!modelInput.id"
                v-model="modelInput.password"
                name="password"
                class=""
                type="password"
                v-validate="{
                  required: true,
                  max: 50,
                  is: modelInput.confirmPassword
                }"
                :error="errors.has('password')"
                :error-message="errors.first('password')"
                outlined
                label="Password *"
                autocomplete="off"
                dense
              />
              <q-input
                clearable
                v-if="!modelInput.id"
                v-model="modelInput.confirmPassword"
                name="confirmPassword"
                class=""
                type="password"
                outlined
                label="Confirm Password *"
                autocomplete="off"
                dense
              />

              <q-input
                v-if="modelInput.id"
                v-model="modelInput.password"
                name="password2"
                class=""
                type="password"
                v-validate="{
                  required: false,
                  max: 50,
                  is: modelInput.confirmPassword
                }"
                :error="errors.has('password2')"
                :error-message="errors.first('password2')"
                outlined
                label="Password *"
                autocomplete="off"
                dense
                hint="Leave empty to keep current user's password"
              />
              <q-input
                v-if="modelInput.id"
                v-model="modelInput.confirmPassword"
                name="confirmPassword2"
                class=""
                type="password"
                outlined
                label="Confirm Password *"
                autocomplete="off"
                dense
              />

              <q-toggle
                v-if="modelInput.id"
                v-model="modelInput.blockUser"
                :label="modelInput.blockUser ? 'Activate' : 'Deactivate'"
                color="negative"
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
    <q-file v-model="file" label="Standard" />
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      modelInput: {},
      loading: false,
      data: [],
      columns: [
        {
          name: "action",
          label: "action",
          field: "action",
          width: "25px",
          align: "center"
        },
        {
          name: "avatar",
          label: "Avatar",
          field: "avatar",
          align: "center"
        },
        {
          name: "userName",
          label: "UserName",
          field: "userName",
          align: "left"
        },
        {
          name: "displayName",
          label: "DisplayName",
          field: "displayName",
          align: "left"
        },
        {
          name: "roleName",
          label: "Role",
          field: "roleName",
          align: "left"
        },
        {
          name: "blockUser",
          label: "status",
          field: "Blocked user",
          align: "left"
        },
        {
          name: "email",
          label: "Email",
          field: "email",
          align: "left"
        },
        {
          name: "phone",
          label: "Phone",
          field: "phone",
          align: "left"
        },
        {
          name: "Notes",
          label: "Notes",
          field: "notes",
          align: "left"
        },
        {
          name: "icnumber",
          label: "IC",
          field: "icNumber",
          align: "left"
        },
        {
          name: "address",
          label: "Address",
          field: "address",
          align: "left"
        },
        {
          name: "modifiedat",
          label: "Last Modified At",
          field: "modifiedAt",
          align: "left",
          format: val => this.$util.toDateString(val)
        }
      ],
      pager: {
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0
      },
      filter: undefined,
      removingLockout: false,
      file: undefined
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async removeLockout(id){
      if(!id) return;
      if(this.removingLockout) return;
      this.removingLockout = true
      try {
        let res = await this.$api.users.removeLockout(id)
        this.data = this.data.map(x =>{
          if(x.id === id) {
            x.lockoutEnd = null;          
          }
          return x
        })
      } catch (error) {
        this.$toatr.error(error)
      }
      this.removingLockout = false
    },
    async save() {
      if (!(await this.$validator.validate())) {
        return;
      }

      if (this.loading) return;
      this.loading = true;
      let res;
      var fdata = this.generateFormData(this.modelInput);
      try {
        if (this.modelInput.id) {
          res = await this.$api.users.put(fdata);
        } else {
          res = await this.$api.users.post(fdata);
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
        var res = await this.$api.users.delete(id);
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
