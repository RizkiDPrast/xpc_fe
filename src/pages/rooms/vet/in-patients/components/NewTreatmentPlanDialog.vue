<template>
  <q-dialog v-model="model" persistent full-height full-width>
    <q-card
      style="width:800px;max-width:calc(100vw - 50px);max-height:calc(100vh - 50px)"
      flat
    >
      <q-toolbar class="bg-purple text-white">
        <q-btn flat round dense icon="las la-feather" />
        <q-toolbar-title>
          Create treatment plans
        </q-toolbar-title>
        <q-btn flat icon="las la-times" v-close-popup color="white" />
      </q-toolbar>
      <q-card-section class="row items-center">
        <q-scroll-area style="height: 550px;width:100%;" class="q-pr-md">
          <q-form class="q-gutter-md" ref="frm">
            <q-stepper
              v-model="step"
              ref="stepper"
              animated
              done-color="deep-orange"
              active-color="purple"
              inactive-color="secondary"
              flat
            >
              <q-step
                :name="1"
                title="Patient Profile"
                icon="las la-horse"
                :done="step > 1"
              >
                <div
                  v-if="
                    patientModel.avatar &&
                      patientModel.avatar != null &&
                      patientModel.avatar.fileUri
                  "
                  class="full-width flex-center"
                >
                  <q-avatar>
                    <q-img :src="patientModel.avatar.fileUri" />
                  </q-avatar>
                </div>

                <my-file-input
                  v-model="patientModel.file"
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
                  readonly
                  v-model="patientModel.animalTypeId"
                  name="animalTypeId"
                  dense
                  outlined
                  input-debounce="50"
                  label="Animal types"
                  v-validate="'required'"
                  data-vv-scope="details"
                  :error="errors.has('animalTypeId')"
                  :error-message="errors.first('animalTypeId')"
                >
                </animal-type-select>
                <q-input
                  v-model="patientModel.name"
                  name="name"
                  readonly
                  outlined
                  label="Name"
                  autocomplete="off"
                  dense
                  v-validate="'required'"
                  data-vv-scope="details"
                  :error="errors.has('name')"
                  :error-message="errors.first('name')"
                />
                <sex-select
                  v-model="patientModel.sex"
                  dense
                  outlined
                  label="Sex"
                  name="sex"
                  v-validate="'required'"
                  data-vv-scope="details"
                  :error="errors.has('sex')"
                  :error-message="errors.first('sex')"
                />
                <date-input
                  dense
                  outlined
                  v-model="patientModel.doB"
                  :hint="'age: ' + patientModel.age"
                  label="DoB"
                  name="dob"
                  v-validate="''"
                  data-vv-scope="details"
                  :error="errors.has('dob')"
                  :error-message="errors.first('dob')"
                />
              </q-step>

              <q-step
                :name="2"
                title="Diagnose"
                icon="las la-diagnoses"
                :done="step > 2"
              >
                <p>
                  <q-input
                    outlined
                    dense
                    debounce="200"
                    v-model="signalementModel.diagnose"
                    type="textarea"
                    rows="3"
                    label="Diagnose"
                    name="diagnose"
                    data-vv-scope="signalement"
                    v-validate="'required'"
                    :error="errors.has('signalement.diagnose')"
                    :error-message="errors.first('signalement.diagnose')"
                  />
                  <q-input
                    outlined
                    dense
                    debounce="200"
                    v-model="signalementModel.notes"
                    type="textarea"
                    rows="3"
                    label="Note"
                    name="notes"
                    data-vv-scope="signalement"
                    v-validate="'required'"
                    :error="errors.has('signalement.notes')"
                    :error-message="errors.first('signalement.notes')"
                  />
                </p>
              </q-step>

              <q-step
                :name="3"
                title="Plans"
                caption="(with duration for each plan)"
                icon="las la-capsules"
                class="no-padding"
              >
                <div class="row">
                  <div class="col-12 col-sm-4 no-padding">
                    <date-input
                      dense
                      outlined
                      v-model="formModel.startAt"
                      label="Start at"
                      data-vv-scope="form"
                      name="startAt"
                      v-validate="'required'"
                      :error="errors.has('form.startAt')"
                      :error-message="errors.first('form.startAt')"
                    />
                  </div>
                  <div
                    class="col-12 col-sm-8  no-padding"
                    style="padding-left:6px!important"
                  >
                    <q-markup-table>
                      <thead>
                        <tr>
                          <th class="text-left">Treatment label</th>
                          <th class="text-left">Description</th>
                          <th class="text-right">Duration <br />(day(s))</th>
                          <th class="text-right"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(v, k) in formModel.treatment_plans"
                          :key="k"
                        >
                          <td class="text-left" style="width:40%">
                            <q-input
                              type="textarea"
                              debounce="200"
                              outlined
                              dense
                              v-model="v.name"
                              rows="2"
                              v-validate="'required|max:30'"
                              data-vv-scope="form"
                              :name="`name[${k}]`"
                              :error="errors.has(`form.name[${k}]`)"
                              :error-message="errors.first(`form.name[${k}]`)"
                            />
                          </td>
                          <td class="text-left" style="width:40%">
                            <q-input
                              type="textarea"
                              debounce="200"
                              outlined
                              dense
                              v-model="v.description"
                              rows="2"
                              v-validate="'max:255'"
                              data-vv-scope="form"
                              :name="`description[${k}]`"
                              :error="errors.has(`form.description[${k}]`)"
                              :error-message="
                                errors.first(`form.description[${k}]`)
                              "
                            />
                          </td>
                          <td class="text-left" style="width:20%">
                            <q-input
                              debounce="200"
                              outlined
                              dense
                              v-model="v.duration"
                              type="number"
                              min="0"
                              step="1"
                              v-validate="'required|between:0,30'"
                              data-vv-scope="form"
                              :name="`duration[${k}]`"
                              :error="errors.has(`form.duration[${k}]`)"
                              :error-message="
                                errors.first(`form.duration[${k}]`)
                              "
                            />
                          </td>
                          <td style="width:10%">
                            <q-btn
                              flat
                              size="sm"
                              icon="las la-plus"
                              @click="addRowT"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </div>
                </div>
              </q-step>

              <!-- <template v-slot:navigation>
            
            </template> -->
            </q-stepper>
          </q-form>
        </q-scroll-area>
      </q-card-section>
      <q-card-actions>
        <q-btn
          v-if="step > 1"
          flat
          color="secondary"
          @click="$refs.stepper.previous()"
          label="Back"
          class="q-ml-sm"
        />
        <q-toolbar-title />

        <q-btn
          @click="step === 3 ? save() : next()"
          color="secondary"
          :label="step === 3 ? 'Save' : 'Continue'"
        />

        <q-btn flat label="Cancel" color="" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "NewTreatmentPlanDialog",
  props: {
    value: {
      type: Boolean,
      default: () => false
    },
    patient: {
      type: Object,
      default: () => {}
    },
    signalement: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      step: 1,
      formModel: {
        startAt: new Date(),
        treatment_plans: [
          {
            name: undefined,
            description: undefined,
            duration: 0
          }
        ]
      },
      patientModel: this.patient || {},
      signalementModel: this.signalement || {},
      submitting: false
    };
  },
  watch: {
    patient(val) {
      this.patientModel = val;
      this.step = 1;
    },
    signalement(val) {
      this.signalementModel = val;
      this.step = 1;
    }
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
    async addRowT() {
      if (!(await this.$validator.validateAll("form"))) {
        this.$toastr.error("Please complete the form then resubmit");
        return;
      }
      this.formModel.treatment_plans.push({
        name: undefined,
        description: undefined,
        duration: 0
      });
    },
    async next() {
      if (this.step === 1) {
        if (!(await this.$validator.validateAll("details"))) {
          this.$toastr.error("Please complete pet details fields");
          return;
        }
        this.$refs.stepper.next();
      } else if (this.step === 2) {
        if (!(await this.$validator.validateAll("signalement"))) {
          this.$toastr.error("Please complete signalement fields");
          return;
        }
        this.$refs.stepper.next();
      }
    },
    async save() {
      if (!(await this.$validator.validateAll("form"))) {
        this.$toastr.error("Please complete the form then resubmit");
        return;
      }
      if (!this.formModel.treatment_plans.length) {
        this.$toastr.error("Please add at least 1 treatment plan");
        return;
      }
      if (this.submitting) return;
      this.submitting = true;
      let model = this.signalementModel;
      model.patient = this.patientModel;
      model.inPatientTreatmentPlans = this.formModel.treatment_plans;
      model.inPatientTreatmentPlans.forEach(element => {
        element.startAt = new Date(this.formModel.startAt);
      });
      var fd = new FormData();
      fd.append("patient.id", model.patient.id);
      fd.append("patient.animalTypeId", model.patient.animalTypeId);
      fd.append("patient.name", model.patient.name);
      fd.append("patient.sex", model.patient.sex);
      if (model.patient.doB && model.patient.doB !== null) {
        fd.append(
          "patient.dob",
          JSON.parse(JSON.stringify(new Date(model.patient.doB)))
        );
      }
      fd.append("patient.file", model.patient.file);

      fd.append("id", model.id);
      fd.append("visitDate", model.visitDate);
      fd.append("diagnose", model.diagnose);
      fd.append("notes", model.notes);
      for (let i = 0; i < model.inPatientTreatmentPlans.length; i++) {
        let item = model.inPatientTreatmentPlans[i];
        fd.append(`inPatientTreatmentPlans[${i}].signalementId`, model.id);
        fd.append(
          `inPatientTreatmentPlans[${i}].startAt`,
          JSON.parse(JSON.stringify(item.startAt))
        );
        fd.append(`inPatientTreatmentPlans[${i}].duration`, item.duration);
        fd.append(`inPatientTreatmentPlans[${i}].name`, item.name);
        fd.append(
          `inPatientTreatmentPlans[${i}].description`,
          item.description
        );
      }

      try {
        let res = await this.$api.inPatientTreatmentPlans.postBulk(fd);

        this.$emit("update:form", res.data);

        //auto add to boarding room
        try {
          await this.$api.onSites.postBoarding(model.patient.id);
          this.$toastr.success("Patient was added to boarding room");
          this.countBoarding();
        } catch (error) {
          this.$toastr.error(error);
        }

        this.model = false;
      } catch (e) {
        this.$toastr.error(e);
      }
      this.submitting = false;
    }
  }
};
</script>
