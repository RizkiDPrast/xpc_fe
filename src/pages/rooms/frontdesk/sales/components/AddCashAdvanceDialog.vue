<template>
  <q-dialog v-model="model">
    <q-card style="width:500px;">
      <dialog-header>
        Add Cash Advance Transaction
      </dialog-header>
      <q-card-section>
        <q-form @submit="onSubmit" v-if="model">
          <user-select
            v-model="modelInput.userId"
            label="User"
            name="user"
            v-validate="'required'"
            :error="errors.has('user')"
            :error-message="errors.first('user')"
            outlined
            dense
            @selected="userSelected"
          />
          <!-- <money-field
            label="Cash in"
            v-model="modelInput.cashIn"
            name="cashIn"
            v-validate="'required|min_value:0'"
            :error="errors.has('cashIn')"
            :error-message="errors.first('cashIn')"
            outlined
            dense
          /> -->
          <money-field
            label="Total"
            v-model="modelInput.cashOut"
            name="Total"
            v-validate="'required|min_value:0'"
            :error="errors.has('Total')"
            :error-message="errors.first('Total')"
            outlined
            dense
          />

          <q-input
            :value="prenoteValue"
            @input="inputNote"
            label="Description"
            name="note"
            v-validate="'required'"
            :error="errors.has('note')"
            :error-message="errors.first('note')"
            outlined
            dense
            type="textarea"
            rows="2"
            hint="add note about what is it used for"
            stack-label
          />
          <submit-button
            class="q-mt-md"
            :loading="isLoading"
            @submit="onSubmit"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import UserSelect from "src/components/UserSelect.vue";
export default {
  components: { UserSelect },
  name: "AddCashAdvanceDialog",
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      modelInput: {
        note: ""
      },
      prenote: "KASBON: ",
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
    },
    prenoteValue() {
      return `${this.prenote}${this.modelInput.note || ""}`;
    }
  },
  methods: {
    inputNote(val) {
      this.modelInput.note = val.replace(this.prenote, "");
    },
    userSelected(user) {
      if (!user || !user.label) {
        this.prenote = "KASBON: ";
        return;
      }
      this.prenote = `KASBON ${user.label}: `;
    },
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
        var obj = JSON.parse(JSON.stringify(this.modelInput));
        obj.note = `${this.prenoteValue}`;
        var res = await this.$api.cashInOuts.post(obj);
        this.$toastr.success("Cash advance was added");
        this.$emit("added", res.data);
        this.modelInput = { note: "" };
        this.model = false;
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
      this.isLoading = false;
    }
  }
};
</script>
