<template>
  <q-page padding>
    <page-header>
      <template #actions>
        <ItemUsageBtn
          v-if="patient.id"
          flat
          :patientId="patient.id"
          rounded
          icon="las la-boxes"
          size="sm"
          text-color="warning"
          class="q-mr-sm"
        >
          <q-tooltip content-class="bg-warning">
            Item usage
          </q-tooltip>
        </ItemUsageBtn>

        <TreatmentPlanBtn
          flat
          rounded
          :signalementId="signalement.id"
          :patient.sync="patient"
          :signalement.sync="signalement"
          @input="plansAdded"
        />
      </template>
    </page-header>
    <q-toolbar>
      <q-btn
        @click="$router.back()"
        icon="las la-arrow-left"
        label="Back"
        rounded
        flat
      />
    </q-toolbar>

    <div
      v-if="loading"
      class="row flex-center "
      style="height:calc(100vh - 50px);"
    >
      <my-circular-progress />
    </div>
    <template v-else>
      <div class="text-center">
        <h5 class="q-mt-md q-mb-xs" v-if="form && form !== null">
          {{ form.code }}
        </h5>
        <patient-avatar :value="patient" size="100px" class="q-mt-md q-mb-sm" />
        <div
          class="full-width row flex-center q-col-gutter-sm q-mb-md"
          style=" align-items: start;"
        >
          <q-markup-table flat borderless class="col-6">
            <tr>
              <td colspan="2" class="bg-grey-3">Patient</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>
                {{ getAnimalTypeName(patient.animalTypeId) }} {{ patient.name }}
              </td>
            </tr>
            <tr>
              <th>Age</th>
              <td>{{ patient.age }}</td>
            </tr>
          </q-markup-table>

          <q-markup-table flat borderless class="col-6">
            <tr>
              <td colspan="4" class="bg-grey-3">
                Clinical signs on arrival -
                {{ $util.toDateString(signalement.createdAt) }}
              </td>
            </tr>
            <tr>
              <th>Weight</th>
              <td class="text-left">{{ signalement.weight || "-" }} kg</td>
              <th>Temp</th>
              <td class="text-left">{{ signalement.temp || "-" }} °C</td>
            </tr>
            <tr>
              <th>Resp</th>
              <td class="text-left">{{ signalement.resp || "-" }} bpm</td>
              <th>Pulse</th>
              <td class="text-left">{{ signalement.pulse || "-" }} bpm</td>
            </tr>
          </q-markup-table>

          <q-markup-table flat borderless class="col-6">
            <tr>
              <td class="bg-grey-3">Diagnose</td>
            </tr>
            <tr>
              <td>
                <b
                  v-html="
                    !signalement.diagnose || signalement.diagnose === null
                      ? '-'
                      : signalement.diagnose.replaceAll('\n', '<br />')
                  "
                ></b>
              </td>
            </tr>
          </q-markup-table>

          <q-markup-table flat borderless class="col-6">
            <tr>
              <td class="bg-grey-3">Notes</td>
            </tr>
            <tr>
              <td
                v-html="
                  !signalement.notes || signalement.notes === null
                    ? '-'
                    : signalement.notes.replaceAll('\n', '<br />')
                "
              >
                <i></i>
              </td>
            </tr>
          </q-markup-table>
        </div>
      </div>
      <q-btn flat rounded no-caps label="Create new form" @click="createForm" />

      <q-card flat bordered v-if="!plans.length">
        <q-card-section>
          Please add treatment plan
        </q-card-section>
      </q-card>
      <template v-else>
        <q-card v-if="generatingForm" class="row flex-center">
          <my-circular-progress />
        </q-card>
        <q-card flat bordered v-else-if="!form.id">
          <q-card-section>
            No data.
            <q-btn
              flat
              rounded
              no-caps
              label="Create new form"
              @click="createForm"
            />
          </q-card-section>
        </q-card>
        <q-markup-table v-else class="table-ranap">
          <thead>
            <q-tr>
              <q-th><div>Date</div></q-th>
              <q-th>Day</q-th>
              <q-th
                style="width:300px"
                v-for="t in plans"
                :key="t.name"
                class="text-bold"
              >
                <span v-html="replaceNewLine(t.name)"> </span>
                <q-tooltip>
                  <i>{{ t.description }}</i>
                </q-tooltip>
              </q-th>
              <q-th v-if="isVet || isAdmin">
                <add-plan-btn
                  flat
                  color="white"
                  icon="las la-plus"
                  label="Add"
                  @plan-added="planAdded"
                  :signalementId="Number(id || 0)"
                />
              </q-th>
            </q-tr>
          </thead>
          <tbody>
            <q-tr v-for="(v, d) in treatmentModel" :key="d">
              <q-td style="width:80px!important">
                {{ new Date(d).toLocaleDateString() }}
                <q-btn
                  v-if="isAdmin"
                  round
                  flat
                  icon="las la-edit"
                  text-color="white"
                  color="white"
                  size="sm"
                  @click="editDate(d)"
                >
                  <q-popup-edit v-model="date" @save="updateDate">
                    <date-input
                      v-model="date"
                      label="Update treatment date"
                      hint="Hit enter to save or Esc to cancel"
                    />
                  </q-popup-edit>
                </q-btn>
              </q-td>
              <q-td style="width:25px!important">
                {{ new Date(d).toDateString().split(" ")[0] }}
              </q-td>
              <q-td
                class="no-padding td-treatment"
                style="padding-top:16px!important"
                v-for="t in plans"
                :key="t.name"
              >
                <q-scroll-area
                  style="width:100%;min-width:200px;height: 200px;"
                >
                  <q-list v-if="v[t.name]">
                    <q-item
                      class="no-padding"
                      v-for="(item, i) in v[t.name]"
                      :key="i"
                    >
                      <q-item-section
                        avatar
                        top
                        style="min-width:35px;width:35px;margin-top: -7px;"
                      >
                        <q-checkbox
                          v-if="item.is_checklist"
                          size="sm"
                          :value="item.value"
                          @input="val => updateBool(val, d, t, i)"
                        />
                      </q-item-section>
                      <q-item-section class="label">
                        <q-item-label>{{ item.label }}</q-item-label>
                        <q-item-label
                          caption
                          lines="2"
                          v-if="item.done_by"
                          style="margin-top: -10px;"
                        >
                          <pre>{{ item.note }} </pre>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side top>
                        <q-avatar
                          size="sm"
                          color="grey"
                          class="q-mr-md q-mt-sm"
                        >
                          <q-img :src="item.done_by_avatar" />
                        </q-avatar>
                        <q-btn size="sm" icon="las la-sticky-note" flat>
                          <q-popup-edit title="add note" :value="item.note">
                            <q-input
                              :value="item.note"
                              dense
                              autofocus
                              debounce="800"
                              @input="evt => updateNote(evt, d, t, i)"
                            />
                          </q-popup-edit>
                        </q-btn>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-scroll-area>
                <q-btn-group
                  class="full-width flex-center shadow-0 q-pb-sm"
                  v-if="isVet || isAdmin"
                >
                  <q-btn
                    flat
                    outline
                    size="xs"
                    icon="las la-plus"
                    color="primary"
                    @click="openDialog(d, t)"
                  />
                  <!-- <q-btn size="xs" icon="las la-cog" color="positive" /> -->
                  <q-btn
                    flat
                    outline
                    size="xs"
                    icon="las la-trash"
                    color="negative"
                    :disable="!v[t.name] || !v[t.name].length"
                    @click="clear(d, t)"
                  />
                </q-btn-group>
              </q-td>
            </q-tr>
            <q-tr v-if="isVet || isAdmin">
              <q-td :colspan="2 + plans.length" class="text-center">
                <q-btn
                  flat
                  no-caps
                  icon="las la-plus"
                  label="Add"
                  @click="showDateDialog"
                />
              </q-td>
            </q-tr>
          </tbody>
        </q-markup-table>
      </template>
    </template>

    <q-dialog v-model="addDateDialog" persistent v-if="isVet || isAdmin">
      <q-card>
        <q-toolbar class="bg-purple text-white">
          <q-icon name="las la-bookmark" />
          <q-toolbar-title>
            Create new treatment date
          </q-toolbar-title>
        </q-toolbar>
        <q-card-section>
          <q-date
            v-model="newDate"
            landscape
            minimal
            :options="minDateOptions"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Save"
            color="primary"
            @click="addDate"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- <q-dialog v-model="addPlanDialog" persistent v-if="isVet">
      <q-card>
        <q-toolbar class="bg-purple text-white">
          <q-icon name="las la-bookmark" />
          <q-toolbar-title>
            Create new treatment plan
          </q-toolbar-title>
        </q-toolbar>
        <q-card-section>
          <q-input
            autofocus
            debounce="200"
            v-model="newPlan"
            type="textarea"
            label="Label"
            rows="2"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Save"
            color="primary"
            @click="addPlan"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    <q-dialog v-model="newTDialog" persistent v-if="(isVet || isAdmin) && t">
      <q-card>
        <q-toolbar class="bg-purple text-white">
          <q-icon name="las la-list-alt" />
          <q-toolbar-title>
            Add task for {{ t.name }} @{{ new Date(d).toLocaleDateString() }}
          </q-toolbar-title>
        </q-toolbar>
        <q-card-section>
          <q-input
            autofocus
            debounce="200"
            v-model="newM.label"
            type="text"
            label="Label"
          />
          <q-select
            v-model="newM.type"
            :options="options"
            label="Type"
            filled
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="add" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <new-default-task ref="taskGen" />
  </q-page>
</template>

<script>
import Patient from "src/models/Patient";
import ItemUsageBtn from "../components/ItemUsageBtn";
import TreatmentPlanBtn from "./components/TreatmentPlanBtn";
import { QSpinnerGears } from "quasar";
import AddPlanBtn from "./components/AddPlanBtn";
import NewDefaultTask from "./components/NewDefaultTask.vue";
export default {
  name: "FormDetails",
  components: {
    TreatmentPlanBtn,
    AddPlanBtn,
    ItemUsageBtn,
    NewDefaultTask
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      loading: false,
      patient: {},
      signalement: {},
      plans: [],
      treatment: {},
      form: {},
      newTDialog: false,
      d: undefined,
      t: {},
      newM: {
        label: undefined,
        is_checklist: true,
        type: "checklist",
        value: false,
        done_by: undefined,
        done_by_avatar: undefined,
        note: undefined
      },
      options: ["checklist", "NA"],
      addPlanDialog: false,
      newPlan: {},
      addDateDialog: false,
      newDate: undefined,
      generatingForm: false,
      tout: undefined,
      updating: false,
      updatingCommission: false,
      date: undefined,
      oriDate: undefined
    };
  },
  computed: {
    mergeForms() {
      var dt = JSON.parse(JSON.stringify(forms));
      for (var sdt of this.$store.state.forms) {
        dt.push(sdt);
      }
      return dt;
    },
    treatmentModel() {
      if (!this.treatment) return {};
      var obj = {};
      var keys = Object.keys(this.treatment).sort((d1, d2) =>
        d2 > d1 ? -1 : 1
      );
      keys.forEach(k => {
        obj[k] = JSON.parse(JSON.stringify(this.treatment[k]));
      });
      return obj;
    }
  },
  mounted() {
    this.fetch();
  },
  destroyed() {
    clearTimeout(this.tout);
  },
  watch: {
    id() {
      this.fetch();
    }
  },
  methods: {
    editDate(d) {
      this.oriDate = d;
      this.date = d;
    },
    updateDate() {
      if (this.date === this.oriDate) return;
      var tgt = this.clone(this.treatment);
      if (!tgt[this.oriDate]) return;

      tgt[this.date] = JSON.parse(JSON.stringify(tgt[this.oriDate]));
      delete tgt[this.oriDate];

      this.treatment = tgt;
      this.saveForm();
    },
    async _updateForm() {
      if (this.updating) {
        return;
      }
      this.updating = true;
      let dismiss = this.$q.notify({
        spinner: QSpinnerGears,
        message: "Updating form...",
        timeout: 0,
        position: "bottom"
      });
      try {
        let form = {
          id: Number(this.id),
          patientId: 0,
          code: "-",
          data: JSON.stringify(this.treatment)
        };

        let res = await this.$api.inPatientTreatmentBoards.put(form);
        this.$toastr.success("Form was updated");
      } catch (e) {
        this.$toastr.error(e);
      }
      this.updating = false;
      dismiss();
    },
    saveForm() {
      if (this.tout) {
        clearTimeout(this.tout);
      }
      this.tout = setTimeout(this._updateForm, 2000);
    },
    minDateOptions(date) {
      let tdate = new Date();
      if (this.treatment) {
        var d = Object.keys(this.treatment).reduce(
          (a, b) => (a > b ? a : b),
          0
        );
        tdate = new Date(d);
      }

      return (
        date >
        tdate
          .toJSON()
          .split("T")[0]
          .replaceAll("-", "/")
      );
    },
    async buildForm() {
      let tasks = await this.$refs.taskGen.getDefaultTasks();
      // console.log("tasks", tasks);
      tasks = tasks.map(x => ({
        label: x,
        is_checklist: true,
        value: false,
        done_by: this.auth.displayName || this.auth.userName,
        done_by_avatar: this.auth.avatar?.fileUri,
        note: undefined
      }));
      // treatment_plan: [{label: '', duration: x}]
      const max = this.plans.reduce(
        (a, b) => (a > b.duration ? a : b.duration),
        0
      );
      const minStartAt = this.plans.reduce(
        (a, b) => (a < b.startAt ? a : b.startAt),
        0
      );
      var t2 = {};
      for (let i = 0; i < max; i++) {
        var d = new Date(minStartAt);
        d.setDate(d.getDate() + i);
        var k = d.toJSON();
        t2[k] = {};
        for (let t = 0; t < this.plans.length; t++) {
          const tr = this.plans[t];
          const dur = tr.duration || 0;
          if (dur <= i) {
            break;
          } else {
            // console.log(i, k, tr.name);
            t2[k][tr.name] = JSON.parse(JSON.stringify(tasks));
          }
        }
      }

      return t2;
    },
    async createForm() {
      if (!this.plans.length) {
        this.$toastr.error("Plans does not exists yet");
        return;
      }
      if (this.generatingForm) return;
      this.generatingForm = true;
      try {
        let data = await this.buildForm();
        let form = {
          id: Number(this.id),
          patientId: 0,
          code: "-",
          data: JSON.stringify(data)
        };
        // form.id = 12;

        let res = await this.$api.inPatientTreatmentBoards.post(form);

        this.$toastr.success("Form was created");
        this.form = form;
        this.treatment = data;
      } catch (e) {
        this.$toastr.error(e);
      }
      this.generatingForm = false;
    },
    plansAdded(plans) {
      if (!this.plans.length) {
        this.plans = plans;
        return;
      }
      plans.forEach(el => {
        if (!this.plans.find(x => x.id === el.id)) {
          this.plans.push(el);
          var tgt = this.clone(this.treatment);
          for (var k in tgt) {
            tgt[k][el.name] = [];
          }
          this.treatment = tgt;
          this.saveForm();
        }
      });
    },
    planAdded(nplan) {
      this.plansAdded([nplan]);
    },
    async fetch() {
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.inPatientTreatmentBoards.getOne(this.id);
        // if (typeof res.data === "string") {
        //   res.data = JSON.parse(res.data);
        // }
        // console.log(typeof res.data, res.data.patient);
        this.patient = new Patient(res.data.patient);
        this.treatment = JSON.parse(
          atob(res.data.inPatientTreatmentBoard?.data || btoa("{}"))
        );
        if (
          res.data.inPatientTreatmentBoard &&
          res.data.inPatientTreatmentBoard !== null
        ) {
          res.data.inPatientTreatmentBoard.data = null;
        }
        this.form = res.data.inPatientTreatmentBoard || {};
        this.signalement = res.data;
        console.log(res.data);
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;

      // var form = this.mergeForms.find(x => x.id === this.id);

      // if (!form) {
      //   this.plans = [];
      //   this.treatment = {};
      //   this.form = {};
      //   return;
      // }
      // this.plans = JSON.parse(JSON.stringify(form.treatment_plan));
      // this.treatment = JSON.parse(JSON.stringify(form.treatment));
      // this.form = JSON.parse(JSON.stringify(form));
    },
    replaceNewLine(val) {
      if (!val || !val.replaceAll) {
        return "";
      }
      return val
        .replaceAll("\n", "{{br /}}")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("{{br /}}", "<br />");
    },
    clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    openDialog(d, t) {
      this.d = d;
      this.t = t;
      this.newM = {
        label: undefined,
        type: "checklist",
        value: false,
        done_by: this.auth.displayName || this.auth.userName,
        done_by_avatar: this.auth.avatar?.fileUri,
        note: undefined
      };
      this.newTDialog = true;
    },
    showDateDialog() {
      this.newDate = undefined;
      this.addDateDialog = true;
    },
    addDate() {
      if (!this.newDate || !new Date(this.newDate).toJSON) return;
      var tgt = this.clone(this.treatment);
      var d = new Date(this.newDate).toJSON();
      tgt[d] = {};
      for (var t of this.plans) {
        tgt[d][t.name] = [];
      }
      this.treatment = tgt;
      this.saveForm();
    },
    add() {
      if (!this.d || !this.t || !this.newM.label) return;
      let tgt = this.clone(this.treatment);

      if (this.newM.type === "checklist") {
        this.newM.is_checklist = true;
      } else {
        this.newM.is_checklist = false;
      }
      console.log("add()", this.d, this.t, tgt);
      if (!tgt[this.d][this.t.name] || tgt[this.d][this.t.name] == null) {
        tgt[this.d][this.t.name] = [];
      }
      tgt[this.d][this.t.name].push(Object.assign({}, this.newM));
      this.treatment = tgt;
      this.d = undefined;
      this.t = {};
      this.saveForm();
    },
    async postInPatientCommission(d, uid) {
      if (this.updatingCommission) return;
      this.updatingCommission = true;
      try {
        let res = await this.$api.commissions.postInPatient({
          date: new Date(d).toJSON(),
          userId: uid
        });
        this.updatingCommission = false;
      } catch (error) {
        this.$toastr.error(error);
        this.updatingCommission = false;
        throw error;
      }
    },
    async updateBool(val, d, t, i) {
      // console.log(val, d, t, i, this.treatment);
      let tgt = this.clone(this.treatment);
      tgt[d][t.name][i] = Object.assign({}, tgt[d][t.name][i], {
        value: val,
        done_by: this.auth.displayName || this.auth.userName,
        done_by_avatar: this.auth.avatar?.fileUri,
        note: ""
      });
      this.treatment = tgt;
      if (val) {
        try {
          await this.postInPatientCommission(d, this.auth.id);
          this.saveForm();
        } catch (error) {
          tgt[d][t.name][i] = Object.assign({}, tgt[d][t.name][i], {
            value: !val,
            done_by: this.auth.displayName || this.auth.userName,
            done_by_avatar: this.auth.avatar?.fileUri,
            note: ""
          });
        }
      } else {
        this.saveForm();
      }
    },
    updateNote(val, d, t, i) {
      let tgt = this.clone(this.treatment);
      tgt[d][t.name][i] = Object.assign({}, tgt[d][t.name][i], {
        done_by: this.auth.displayName || this.auth.userName,
        done_by_avatar: this.auth.avatar?.fileUri,
        note: val
      });
      this.treatment = tgt;
      this.saveForm();
    },
    clear(d, t) {
      if (
        !confirm(
          "This action will clear all treatment datas on this block. Do you want to continue?"
        )
      ) {
        return;
      }
      let tgt = this.clone(this.treatment);
      tgt[d][t.name] = [];
      this.treatment = tgt;
      this.saveForm();
    }
  }
};
</script>

<style lang="sass" scoped>
.th
  position: sticky
  top:  0

.td-treatment
  width:  300px
  max-width: 300px
  border: 0.5px solid #f0f0f0
  overflow: hidden

.td-treatment .label
  max-width:  200px
  white-space: break-spaces
  line-height: 0.5rem
  align-self: start

.label pre
  max-width:  200px
  overflow-wrap: break-word
  overflow: hidden
  white-space: pre-wrap
</style>

<style lang="scss" scoped>
.table-ranap {
  max-height: calc(100vh - 50px);
}
.table-ranap tr > th:not(first-child) {
  position: sticky !important;
  top: 0;
  background-color: $primary !important;
  color: white !important;
  opacity: 1;
  z-index: 1;
}

.table-ranap tr > td:first-child,
.table-ranap tr > th:first-child {
  background-color: $primary;
  position: sticky;
  left: 0;
  opacity: 1;
  z-index: 1;
  color: white;
}

.table-ranap tbody > tr:nth-child(2n - 2) {
  background-color: #1976d21a !important;
}
</style>
