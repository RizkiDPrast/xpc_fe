<template>
  <q-dialog v-model="model">
    <q-card style="width:500px;">
      <q-toolbar>
        <q-toolbar-title>
          Add deposit
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section>
        <q-form @submit="onSubmit" v-if="model">
          <client-select
            autofocus
            v-model="depositModel.clientId"
            label="Client"
            name="clientId"
            v-validate="'required'"
            :error="errors.has('clientId')"
            :error-message="errors.first('clientId')"
            outlined
            dense
          />
          <money-field
            label="In"
            v-model="depositModel.credit"
            name="credit"
            v-validate="'required|min_value:0'"
            :error="errors.has('credit')"
            :error-message="errors.first('credit')"
            outlined
            dense
          />
          <money-field
            label="Out"
            v-model="depositModel.debit"
            name="debit"
            v-validate="'required|min_value:0'"
            :error="errors.has('debit')"
            :error-message="errors.first('debit')"
            outlined
            dense
          />

          <q-input
            v-model="depositModel.note"
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
          <submit-button :loading="isLoading" @submit="onSubmit" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import DepositTransaction from "src/models/DepositTransaction";
export default {
  name: "AddDepositDialog",
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      depositModel: new DepositTransaction(),
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
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      await this.$validator.validateAll();
      if (this.errors.any()) {
        this.$toastr.error("Please fill all required fields");
        this.isLoading = false;
      } else {
        try {
          var res = await this.$api.deposits.post(this.depositModel);
          this.$toastr.success("Deposit was added");
          this.$emit("added", new DepositTransaction(res.data));
          this.depositModel = new DepositTransaction();
          this.model = false;
        } catch (e) {
          this.$toastr.error(this.$util.err(e));
        }
        this.isLoading = false;
      }
    }
  }
};
</script>
