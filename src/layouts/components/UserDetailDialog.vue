<template>
  <q-dialog v-model="model">
    <q-card class="my-card" style="width:500px;">
      <q-toolbar>
        <q-toolbar-title>
          Add / Edit User
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section>
        <q-form @submit.prevent="save" class="q-col-gutter-md full-width">
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
            :value="auth.userName"
            class="non-selectable"
            outlined
            label="UserName *"
            dense
            disable
          />

          <q-input
            :value="auth.roleName"
            outlined
            class="non-selectable"
            label="Role *"
            dense
            disable
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
            ref="name"
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

          <q-input
            clearable
            v-model="modelInput.password"
            name="password"
            class=""
            type="password"
            v-validate="{
              required: false,
              max: 50,
              is: modelInput.confirmPassword
            }"
            :error="errors.has('password')"
            :error-message="errors.first('password')"
            outlined
            label="Password *"
            autocomplete="off"
            dense
            hide-hint="false"
            hint="Leave empty to keep your current's password"
          />
          <q-input
            clearable
            v-model="modelInput.confirmPassword"
            name="confirmPassword"
            class=""
            type="password"
            outlined
            label="Confirm Password *"
            autocomplete="off"
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
  </q-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      loading: false,
      modelInput: {}
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
    }
  },
  watch: {
    value(nval) {
      if (nval) {
        this.modelInput = Object.assign({}, this.auth, {
          password: undefined,
          confirmPassword: undefined
        });
      }
    }
  },
  methods: {
    async save(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      if (!(await this.$validator.validate())) {
        return;
      }

      if (this.loading) return;
      this.loading = true;
      let res;
      var fdata = this.generateFormData(this.modelInput);
      try {
        res = await this.$api.auth.put(fdata);
        this.$toastr.success("Record was updated");
        if (this.modelInput && this.modelInput !== null) {
          this.$store.commit("logout");
          this.$router.replace("/app/rooms");
        } else {
          this.$store.commit("login", this.modelInput);
        }

        location.reload();

        this.modelInput = {};
        this.loading = false;
        this.model = false;
      } catch (error) {
        this.loading = false;
        this.$toastr.error(error);
        throw error;
      }
    }
  }
};
</script>
