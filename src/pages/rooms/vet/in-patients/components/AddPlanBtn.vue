<template>
  <span>
    <q-btn v-bind="$attrs" @click="model = true" />
    <q-dialog v-model="model" persistent>
      <q-card>
        <q-toolbar class="bg-purple text-white">
          <q-icon name="las la-bookmark" />
          <q-toolbar-title>
            Create new treatment plan
          </q-toolbar-title>
          <q-btn flat round icon="las la-times" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-input
            autofocus
            v-model="modelInput.name"
            name="name"
            v-validate="'required|max:30'"
            :error="errors.has('name')"
            :error-message="errors.first('name')"
            label="Label"
          />
          <q-input
            v-model="modelInput.description"
            type="textarea"
            label="Decription"
            rows="2"
            name="description"
            v-validate="'max:255'"
            :error="errors.has('description')"
            :error-message="errors.first('description')"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Save"
            color="primary"
            @click="save"
            v-close-popup
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </span>
</template>
<script>
export default {
  props: {
    signalementId: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      model: false,
      modelInput: {},
      loading: false
    };
  },
  methods: {
    async save() {
      if (!(await this.$validator.validateAll())) {
        this.$toastr.error("Please complete the form");
        return;
      }
      if (this.loading) return;
      this.loading = true;
      try {
        this.modelInput.signalementId = this.signalementId;
        this.modelInput.startAt = new Date().toJSON();
        let res = await this.$api.inPatientTreatmentPlans.post(this.modelInput);
        this.$emit("plan-added", res.data);
        this.model = false;
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    }
  }
};
</script>
