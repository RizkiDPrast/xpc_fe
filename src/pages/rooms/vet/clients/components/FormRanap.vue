<template>
  <q-form @submit="onSubmit" class="">
    <div class="row q-col-gutter-sm">
      <!-- <fieldset>
        <legend>Detail klien</legend> -->
      <div class="col-12 text-grey q-mb-sm text-center">
        Detail klien
      </div>
      <q-input
        readonly
        label="Code"
        v-model="model.clientCode"
        dense
        outlined
        class="col-sm-12 col-md-4 q-my-sm q-py-xs"
        name="code"
        v-validate="'required'"
        :error="errors.has('code')"
        :error-message="errors.first('code')"
        debounce="500"
      />
      <q-input
        class="col-sm-12 col-md-8 q-my-sm q-py-xs"
        v-model="model.nama"
        type="text"
        name="name"
        label="Nama"
        v-validate="'required'"
        :error="errors.has('name')"
        :error-message="errors.first('name')"
        :readonly="loading"
        dense
        outlined
        autocomplete="off"
        debounce="500"
      />
      <q-input
        class="col-sm-12 col-md-4 q-my-sm q-py-xs"
        v-model="model.nik"
        type="text"
        name="nik"
        label="NIK"
        v-validate="'required'"
        :error="errors.has('nik')"
        :error-message="errors.first('nik')"
        :readonly="loading"
        dense
        outlined
        autocomplete="off"
        debounce="500"
      />
      <q-input
        class="col-sm-12 col-md-4 q-my-sm q-py-xs"
        v-model="model.hp"
        type="text"
        name="hp"
        label="HP"
        v-validate="'required'"
        :error="errors.has('hp')"
        :error-message="errors.first('hp')"
        :readonly="loading"
        dense
        outlined
        autocomplete="off"
        debounce="500"
      />
      <q-input
        class="col-sm-12 col-md-4 q-my-sm q-py-xs"
        v-model="model.email"
        type="text"
        name="email"
        label="Email"
        v-validate="'required|email'"
        :error="errors.has('email')"
        :error-message="errors.first('email')"
        :readonly="loading"
        dense
        outlined
        autocomplete="off"
        debounce="500"
      />
      <q-input
        class="col-sm-12 col-md-12 q-my-sm q-py-xs"
        v-model="model.alamat"
        type="textarea"
        rows="3"
        name="alamat"
        label="alamat"
        v-validate="'required'"
        :error="errors.has('alamat')"
        :error-message="errors.first('alamat')"
        :readonly="loading"
        dense
        outlined
        autocomplete="off"
        debounce="500"
      />

      <div class="col-12 text-grey q-mb-sm q-mt-md text-center">
        Detail Pasien
      </div>
      <q-input
        readonly
        label="Jenis"
        v-model="model.animalType"
        dense
        outlined
        class="col-sm-12 col-md-6 q-my-sm q-py-xs"
        name="jenis"
        v-validate="'required'"
        :error="errors.has('jenis')"
        :error-message="errors.first('jenis')"
        debounce="500"
      />
      <q-input
        readonly
        label="patientName"
        v-model="model.patientName"
        dense
        outlined
        class="col-sm-12 col-md-6 q-my-sm q-py-xs"
        name="patientName"
        v-validate="'required'"
        :error="errors.has('patientName')"
        :error-message="errors.first('patientName')"
        debounce="500"
      />

      <div class="col-12 text-grey q-mb-sm q-mt-md text-center">
        Dokter Hewan yang menangani
      </div>
      <q-input
        readonly
        v-model="model.vetName"
        dense
        outlined
        class="col-sm-12 col-md-12 q-my-sm q-py-xs"
        name="vetName"
        v-validate="'required'"
        :error="errors.has('vetName')"
        :error-message="errors.first('vetName')"
        debounce="500"
      />

      <div class="col-12 text-grey q-mb-sm q-mt-md text-center">
        Detail form
      </div>
      <q-input
        class="col-sm-12 col-md-12 q-my-sm q-py-xs"
        v-model="model.kondisiHewan"
        type="text"
        name="kondisiHewan"
        label="Kondisi Hewan"
        v-validate="'required'"
        :error="errors.has('kondisiHewan')"
        :error-message="errors.first('kondisiHewan')"
        :readonly="loading"
        dense
        outlined
        autocomplete="off"
        debounce="500"
      />
      <q-input
        class="col-sm-12 col-md-12 q-my-sm q-py-xs"
        v-model="model.saran"
        type="textarea"
        rows="3"
        name="saran"
        label="Saran"
        v-validate="'required'"
        :error="errors.has('saran')"
        :error-message="errors.first('saran')"
        :readonly="loading"
        dense
        outlined
        autocomplete="off"
        debounce="500"
      />

      <q-checkbox
        :label="
          model.clientAgree === false
            ? 'Klien tidak setuju'
            : 'Klien telah setuju'
        "
        v-model="model.clientAgree"
        :readonly="loading"
        name="clientAgree"
        v-validate="'requiredTrueFalse'"
        :error="errors.has('clientAgree')"
        :error-message="errors.first('clientAgree')"
      />
      <q-btn
        class="col-12 q-mt-md"
        label="Submit"
        type="submit"
        color="primary"
        :loading="loading"
      />
    </div>
  </q-form>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    clientAgree: {
      type: Boolean,
      default: () => undefined
    },
    dataPrev: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      model: this.value,
      loading: false
    };
  },
  watch: {
    // value: {
    //   handler(val) {
    //     console.log("val", val);
    //     this.model = JSON.parse(JSON.stringify(val));
    //   }
    //   //   deep: true
    // },
    value(val) {
      this.model = JSON.parse(JSON.stringify(val));
    },
    clientAgree(val) {
      this.model.clientAgree = val;
    },
    model: {
      handler(val) {
        this.$emit("update:data-prev", val);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async onSubmit() {
      if (
        typeof this.model.clientAgree === "undefined" ||
        this.model.clientAgree === null
      ) {
        this.$toastr.error("Please check client agreement status");
        return;
      }
      if (!(await this.$validator.validateAll())) {
        this.$toastr.error("Please complete the form");
        return;
      }
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.formPasien[
          `put${this.model.signalementAction}`
        ](this.model);
        this.$toastr.success("Data was updated");
        this.$emit("input", res.data);
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    }
  }
};
</script>
