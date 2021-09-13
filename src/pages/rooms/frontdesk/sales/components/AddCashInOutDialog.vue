<template>
  <q-dialog v-model="model">
    <q-card style="width:500px;">
        <dialog-header>
          Add Cash in out transaction
        </dialog-header>
      <q-card-section>
        <q-form @submit="onSubmit" v-if="model">
          <money-field
            label="Cash in"
            v-model="modelInput.cashIn"
            name="cashIn"
            v-validate="'required|min_value:0'"
            :error="errors.has('cashIn')"
            :error-message="errors.first('cashIn')"
            outlined
            dense
          />
          <money-field
            label="Cash out"
            v-model="modelInput.cashOut"
            name="cashOut"
            v-validate="'required|min_value:0'"
            :error="errors.has('cashOut')"
            :error-message="errors.first('cashOut')"
            outlined
            dense
          />

          <q-input
            v-model="modelInput.note"
            label="Description"
            name="note"
            v-validate="'required'"
            :error="errors.has('note')"
            :error-message="errors.first('note')"
            outlined
            dense
            type="textarea"
            rows="2"
          />
          <submit-button  class="q-mt-md" :loading="isLoading" @submit="onSubmit" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "CashInOutDialog",
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      modelInput: {},
      isLoading: false
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
  methods: {
    async onSubmit() {
      if (!(await this.$validator.validateAll())) {
        this.$toastr.error("Please fill all required fields");
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;

      try {
        var res = await this.$api.cashInOuts.post(this.modelInput);
        this.$toastr.success("Record was added");
        this.$emit("added", res.data);
        this.modelInput = {};
        this.model = false;
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
      this.isLoading = false;
    }
  }
};
</script>
