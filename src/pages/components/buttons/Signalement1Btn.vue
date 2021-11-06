<template>
  <span>
    <q-btn v-bind="$attrs" v-on="$listeners" @click.stop="modal = true">
      <slot> </slot>
    </q-btn>
    <q-dialog v-model="modal" persistent>
      <q-card>
        <q-toolbar class="bg-secondary text-white">
          <q-toolbar-title>
            {{ model.id > 0 ? `Edit visit data` : "Add visit data" }}
          </q-toolbar-title>
          <q-btn round flat icon="las la-times" v-close-popup />
        </q-toolbar>
        <q-card-section style="width:500px;max-width:calc(100vw - 25px)">
          <validation-summary
            :value="$store.state.errors"
            @input="$store.commit('clearErrors')"
          />

          <q-form class="full-width" @submit="saveModel">
            <q-scroll-area style="height:350px" class="full-width">
              <div class="row q-col-gutter-sm">
                <date-input
                  label="Visit date"
                  v-model="model.visitDate"
                  style="min-width:157px;"
                  name="visitDate"
                  maxToday
                  v-validate="'required'"
                  :error="errors.has('visitDate')"
                  :error-message="errors.first('visitDate')"
                  dense
                  outlined
                  class="col-12"
                />

                <q-input
                  label="Weight (kg)"
                  v-model="model.weight"
                  name="weight"
                  v-validate="'between:0,1000'"
                  :error="errors.has('weight')"
                  :error-message="errors.first('weight')"
                  dense
                  outlined
                  class="col-6"
                />

                <q-input
                  label="Temp (°C)"
                  v-model="model.temp"
                  name="temp"
                  v-validate="''"
                  :error="errors.has('temp')"
                  :error-message="errors.first('temp')"
                  dense
                  outlined
                  class="col-6"
                />

                <q-input
                  label="Resp (bpm)"
                  v-model="model.resp"
                  name="resp"
                  v-validate="'between:0,200'"
                  :error="errors.has('resp')"
                  :error-message="errors.first('resp')"
                  dense
                  outlined
                  class="col-6"
                />

                <q-input
                  label="Pulse (npm)"
                  v-model="model.pulse"
                  name="pulse"
                  v-validate="'between:0,200'"
                  :error="errors.has('pulse')"
                  :error-message="errors.first('pulse')"
                  dense
                  outlined
                  class="col-6"
                />

                <user-select
                  readonly
                  label="Treated by"
                  :roleNames="['veterinarian']"
                  v-model="model.treatedBy"
                  style="min-width:135px;"
                  dense
                  outlined
                  class="col-12"
                  hint="Please input from medical record"
                />
              </div>
            </q-scroll-area>

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
        </q-card-section>
      </q-card>
    </q-dialog>
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      modal: false,
      model: Object.assign({}, { visitDate: new Date() }, this.value),
      loading: false
    };
  },
  watch: {
    value(val) {
      this.model = Object.assign({}, val);
    }
  },
  methods: {
    async saveModel() {
      let isEditing = this.model.id;
      if (!(await this.$validator.validate())) {
        this.$toastr.error("Please complete form then resubmit");
        return;
      }

      if (this.loading) return;
      this.loading = true;
      try {
        var m = this.model;
        if (m.weight) {
          m.weight = Number(m.weight);
        }
        if (m.temp) {
          m.temp = Number(m.temp);
        }
        if (m.resp) {
          m.resp = Number(m.resp);
        }
        if (m.pulse) {
          m.pulse = Number(m.pulse);
        }
        var res = isEditing
          ? await this.$api.signalements.putVisit(m)
          : await this.$api.signalements.post(m);
        if (res.status < 300) {
          this.$toastr.success("Record was updated");
          this.$emit("input", res.data);
          this.modal = false;
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
