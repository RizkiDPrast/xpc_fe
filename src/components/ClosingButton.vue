<template>
  <div>
    <q-btn
      flat
      bordered
      class="q-ml-sm"
      label="Closing"
      @click="dailyClosing"
      text-color="negative"
      :loading="closing"
    >
      <q-tooltip>
        Close daily sales, purchases, deposits and petty cash
      </q-tooltip>
    </q-btn>
    <q-dialog persistent v-model="closingDialog">
      <q-card>
        <q-card-section>
          <q-banner>
            Please input remaining balance for petty cash
            <money-field
              autofocus
              name="pettycash"
              v-model="pettycash"
              v-validate="'required|min_value:0'"
              :error="errors.has('pettycash')"
              :error-message="errors.first('pettycash')"
              outlined
              dense
            />
          </q-banner>
        </q-card-section>
        <q-card-section class="row">
          <q-space /> <q-btn flat label="Cancel" @click="cancel" />
          <q-btn @click="save" flat color="primary" label="Submit" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "DailyClosingButton",
  data() {
    return {
      closing: false,
      closingDialog: false,
      pettycash: 0
    };
  },
  methods: {
    async dailyClosing() {
      if (!confirm("You are going to close current Sales. Continue?", "Ok")) {
        return;
      }
      let res = await this.$api.cashInOuts.getTotal();

      this.pettycash = !Number.isNaN(res.data)
        ? res.data
        : this.$store.state.config.defaultPettyCash || 0;
      this.closingDialog = true;
    },
    cancel() {
      this.closingDialog = false;
    },
    async save() {
      if (!(await this.$validator.validateAll())) {
        this.$toastr.error("Please input value greater than 0");
        return;
      }
      if (this.closing) return;
      this.closing = true;
      this.closingDialog = false;

      try {
        await this.$api.sales.closing({ pettycash: this.pettycash });
        this.$emit("salesClosed");

        this.$toastr.success("Daily Sale has been closed");
        window.location.reload();
      } catch (e) {
        this.$toastr.error(e);
      }
      this.closing = false;
    }
  }
};
</script>
