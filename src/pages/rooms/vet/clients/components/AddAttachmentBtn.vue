<template>
  <div>
    <q-btn flat round icon="las la-plus" @click="dialog = true" />
    <q-dialog v-model="dialog">
      <q-card style="width:500px">
        <dialog-header title="Add attachment" />
        <q-card-section>
          <q-form @submit="save" class="q-col-gutter-md full-width">
            <my-file-input
              v-model="modelInput.file"
              outlined
              dense
              label="File"
              :max-file-size="10 * 1024 * 1024"
              clearable
              hint="file with maximum size of 10 MB"
              name="file"
            />

            <q-input
              ref="description"
              v-model="modelInput.description"
              name="description"
              class=""
              v-validate="'required'"
              :error="errors.has('description')"
              :error-message="errors.first('description')"
              outlined
              label="Description *"
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
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: [Number],
      default: () => undefined
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      modelInput: {}
    };
  },
  methods: {
    async save() {
      if (!this.id) return;
      if (!(await this.$validator.validate())) {
        this.$toastr.error("Please complete all fields before submitting");
        return;
      }

      if (this.loading) return;
      this.loading = true;
      var fdata = this.generateFormData(this.modelInput);
      try {
        let res = await this.$api.signalements.uploadAttachment(this.id, fdata);
        this.$toastr.success("Attachment was uploaded");
        this.modelInput = {};
        this.$emit("added", res.data);
        this.loading = false;
        this.dialog = false;
      } catch (error) {
        this.$toastr.error(error);
        this.loading = false;
      }
    }
  }
};
</script>
