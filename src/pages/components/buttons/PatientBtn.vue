<template>
  <span>
    <q-btn v-bind="$attrs" v-on="$listeners" @click.stop="modal = true">
      <slot> </slot>
    </q-btn>
    <q-dialog v-model="modal" persistent>
      <q-card v-if="modal">
        <q-toolbar class="bg-secondary text-white">
          <q-toolbar-title>
            {{ model.id > 0 ? `Edit ${model.name}` : "Add new pet" }}
          </q-toolbar-title>
          <q-btn round flat icon="las la-times" v-close-popup />
        </q-toolbar>
        <q-card-section style="width:500px;max-width:calc(100vw - 25px)">
          <q-scroll-area style="height:500px" class="full-width">
            <validation-summary
              :value="$store.state.errors"
              @input="$store.commit('clearErrors')"
            />

            <q-form class="full-width" @submit="saveModel">
              <div
                v-if="
                  model.avatar && model.avatar != null && model.avatar.fileUri
                "
                class="full-width flex-center"
              >
                <q-avatar>
                  <q-img :src="model.avatar.fileUri" />
                </q-avatar>
              </div>

              <my-file-input
                v-model="model.file"
                outlined
                dense
                name="file"
                label="Avatar"
                accept="image/*"
                :max-file-size="1 * 1024 * 1024"
                clearable
                hint="Image file with maximum size of 1 MB"
              />

              <animal-type-select
                v-model="model.animalTypeId"
                name="animalTypeId"
                v-validate="'required'"
                :error="errors.has('animalTypeId')"
                :error-message="errors.first('animalTypeId')"
                :outlined="true"
                input-debounce="50"
                label="Animal types"
              >
                <template #after>
                  <animal-types-btn flat round />
                </template>
              </animal-type-select>
              <q-input
                v-model="model.name"
                name="name"
                class=""
                v-validate="'required|max:255'"
                :error="errors.has('name')"
                :error-message="errors.first('name')"
                outlined
                label="Name"
                autocomplete="off"
              />
              <sex-select v-model="model.sex" outlined label="Sex" />
              <date-input
                v-model="model.doB"
                class="q-mt-md"
                :hint="'age: ' + model.age"
                label="DoB"
              />

              <q-btn
                :loading="loading"
                icon="las la-save"
                label="Save"
                title="Save"
                text-color="white"
                class="full-width q-mt-xl"
                color="secondary"
                :disable="loading"
                @click.stop="saveModel"
              />
            </q-form>
          </q-scroll-area>
        </q-card-section>
      </q-card>
    </q-dialog>
  </span>
</template>

<script>
import Patient from "src/models/Patient";
export default {
  props: {
    value: {
      type: Patient,
      required: true
    },
    clientId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      modal: false,
      model: new Patient({ ...this.value, clientId: this.clientId }),
      loading: false
    };
  },
  watch: {
    value(val) {
      this.model = new Patient({ ...val, clientId: this.clientId });
    }
  },
  methods: {
    async saveModel() {
      if (!(await this.$validator.validate())) {
        this.$toastr.error("Please fix all error(s) then resubmit");
        return;
      }

      if (this.loading) return;
      this.loading = true;

      this.model.clientId = this.clientId;
      var editing = this.model.id > 0;
      var fdata = this.generateFormData(this.model);
      try {
        var res = await (editing
          ? this.$api.patients.put(fdata)
          : this.$api.patients.post(fdata));
        if (res.status < 300) {
          this.modal = false;
          this.$toastr.success(
            editing ? "Pet was updated" : "New pet was added"
          );
          var nPatient = new Patient(res.data);
          this.$emit("input", nPatient);
          this.modal = false;
        } else {
          this.$toastr.error(res.message);
        }
      } catch (e) {
        this.$toastr.error(e);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
