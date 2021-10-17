<template>
  <q-dialog v-model="model" full-height full-width>
    <q-card>
      <dialog-header class="text-white bg-primary" :title="formType" />
      <q-card-section v-if="loading" class="row flex-center">
        <my-circular-progress />
      </q-card-section>
      <q-card-section v-else-if="!data || !data.id" class="row flex-center">
        Please select from consent form list
      </q-card-section>
      <q-card-section v-else class="row q-col-gutter-sm">
        <div class="col-sm-12 col-md-6">
          <q-scroll-area style="width: 100%; height: 800px;" class="q-pr-md">
            <keep-alive>
              <component
                :is="formType"
                :value="data"
                @input="dialog = false"
                :dataPrev.sync="dataPrev"
                :clientAgree="data.clientAgree"
              />
            </keep-alive>
          </q-scroll-area>
        </div>
        <div class="col-sm-12 col-md-6">
          <q-scroll-area style="width: 100%; height: 800px;" class="q-pr-md">
            <keep-alive>
              <component :is="`${formType}Preview`" :value="dataPrev" />
            </keep-alive>
            <q-checkbox
              v-if="data.signalementAction !== 'Rujukan'"
              v-model="data.clientAgree"
              label="Saya telah membaca dan menyetujui isi konsen form ini"
            />
          </q-scroll-area>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import FormBerhentiRanap from "./FormBerhentiRanap";
import FormBerhentiRanapPreview from "./FormBerhentiRanapPreview";
import FormRanap from "./FormRanap";
import FormRanapPreview from "./FormRanapPreview";
import FormRalan from "./FormRalan";
import FormRalanPreview from "./FormRalanPreview";
import FormOpKhusus from "./FormOpKhusus";
import FormOpKhususPreview from "./FormOpKhususPreview";
import FormOp from "./FormOp";
import FormOpPreview from "./FormOpPreview";
import FormEuthanasia from "./FormEuthanasia";
import FormEuthanasiaPreview from "./FormEuthanasiaPreview";
import FormRujukan from "./FormRujukan";
import FormRujukanPreview from "./FormRujukanPreview";

export default {
  components: {
    FormBerhentiRanap,
    FormBerhentiRanapPreview,
    FormRanap,
    FormRanapPreview,
    FormRalan,
    FormRalanPreview,
    FormOpKhusus,
    FormOpKhususPreview,
    FormOp,
    FormOpPreview,
    FormEuthanasia,
    FormEuthanasiaPreview,
    FormRujukan,
    FormRujukanPreview
  },
  props: {
    value: {
      type: Boolean,
      default: () => false
    },
    id: {
      type: [Number, String],
      default: () => 0
    },
    signalementAction: {
      type: String,
      default: () => undefined
    }
  },
  data() {
    return {
      loading: false,
      data: {},
      dataPrev: {}
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
    formType() {
      let type;
      switch (this.signalementAction) {
        case "RawatInap":
          type = "FormRanap";
          break;
        case "RawatJalan":
          type = "FormRalan";
          break;
        case "BerhentiRawatInap":
          type = "FormBerhentiRanap";
          break;
        case "Operasi":
          type = "FormOp";
          break;
        case "OperasiKhusus":
          type = "FormOpKhusus";
          break;
        case "Euthanasia":
          type = "FormEuthanasia";
          break;
        case "Rujukan":
          type = "FormRujukan";
          break;

        default:
          throw `invalid signalementAction: ${this.signalementAction}`;
          break;
      }
      return type;
    }
  },
  watch: {
    id(val) {
      this.fetch();
    },
    value(val) {
      if (val) {
        this.fetch();
      }
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch() {
      if (!this.id) {
        return;
      }
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        var res = await this.$api.formPasien.getOne(this.id);
        this.data = res.data;
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    }
  }
};
</script>
