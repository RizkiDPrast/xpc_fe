<template>
  <div>
    <q-btn v-bind="$attrs" @click="modal = true">
      Treatment plan
    </q-btn>

    <q-dialog full-width full-height v-model="modal">
      <q-card flat>
        <dialog-header title="Treatment Plans">
          <template #actions>
            <add-plan-btn
              flat
              round
              color="primary"
              icon="las la-plus"
              @plan-added="planAdded"
              :signalementId="signalementId"
            />
          </template>
        </dialog-header>
        <q-card-section v-if="loading">
          <my-circular-progress />
        </q-card-section>
        <q-card-section
          v-else-if="!modelInput.length"
          class="flex flex-center"
          style="height:500px"
        >
          There is no treatment plan record.
          <q-btn
            flat
            rounded
            color="primary"
            label="Add now?"
            no-caps
            @click="addBulk"
            :loading="loading"
          />
        </q-card-section>
        <q-card-section v-else>
          <q-markup-table flat>
            <thead>
              <th>Label</th>
              <th>Description</th>
              <th>Created at</th>
              <th>Created by</th>
            </thead>
            <tbody>
              <tr v-for="item in modelInput" :key="item.id">
                <td class="text-center">{{ item.name }}</td>
                <td class="text-center">{{ item.description }}</td>
                <td class="text-center">
                  {{ $util.toDateString(item.createdAt) }}
                </td>
                <td class="text-center">{{ item.createdByName }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <NewTreatmentPlanDialog
      v-model="bulkaddDialog"
      :patient="patientModel"
      :signalement="signalementModel"
      @update:form="updateForm"
    />
  </div>
</template>
<script>
import NewTreatmentPlanDialog from "./NewTreatmentPlanDialog";
import AddPlanBtn from "./AddPlanBtn";
import Patient from "src/models/Patient";
export default {
  components: {
    NewTreatmentPlanDialog,
    AddPlanBtn
  },
  props: {
    signalementId: {
      type: Number,
      default: () => 0
    },
    value: {
      type: Object,
      default: () => {}
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
      modal: false,
      modelInput: {},
      bulkaddDialog: false,
      loading: false,
      submitting: false,

      patientModel: this.patient || {},
      signalementModel: this.signalement || {}
    };
  },
  watch: {
    signalementId() {
      this.fetch();
    },
    patient(val) {
      this.patientModel = new Patient(JSON.parse(JSON.stringify(val)));
      this.step = 1;
    },
    signalement(val) {
      this.signalementModel = JSON.parse(JSON.stringify(val));
      this.step = 1;
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch() {
      if (!this.signalementId) return;
      if (this.loading) return;
      this.loading = true;
      try {
        let res = await this.$api.inPatientTreatmentPlans.get(
          this.signalementId
        );
        this.modelInput = res.data;
        this.$emit("input", res.data);
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    },
    addBulk() {
      this.bulkaddDialog = true;
    },
    planAdded(plan) {
      this.$emit("input", [plan]);
    },
    updateForm(signalement) {
      this.$emit("update:signalement", signalement);
      this.$emit("update:patient", signalement.patient);
      this.modelInput = signalement.inPatientTreatmentPlans;
      this.$emit("input", this.modelInput);
    }
  }
};
</script>
