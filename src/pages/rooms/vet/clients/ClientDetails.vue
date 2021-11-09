<template>
  <q-page padding>
    <page-header title="Client details and signalements">
      <template #actions>
        <animal-types-btn flat round />
      </template>
    </page-header>
    <div class="row full-width flex-center" v-if="!model || model == null">
      <my-circular-progress />
    </div>

    <q-card v-else class="bordered no-shadow q-mt-md">
      <q-toolbar flat>
        <q-btn icon="las la-arrow-left" dense flat @click="$router.back()" />
        <q-toolbar-title>
          Client details
        </q-toolbar-title>
        <BtnMoveClient v-model="onsite" class="q-mr-sm" />
        <ItemUsageBtn
          flat
          :clientId="model.id"
          v-if="model.id !== 0"
          rounded
          icon="las la-boxes"
          size="sm"
          text-color="primary"
          class="q-mr-sm"
        >
          <q-tooltip content-class="bg-primary">
            Item usage
          </q-tooltip>
        </ItemUsageBtn>
        <client-appointment-btn
          :client="model"
          flat
          round
          color="secondary"
          icon="las la-calendar-alt"
        />
      </q-toolbar>
      <q-card-section>
        <q-form
          autocomplete="off"
          class="row full-width q-col-gutter-xs"
          @submit="saveClientDetails"
        >
          <input type="hidden" :value="model.id" ref="fid" />

          <q-input
            :hint="
              !model.code ||
              model.code == null ||
              model.code.trim() === '' ||
              model.code === '-'
                ? 'auto'
                : ''
            "
            class="col-sm-12 col-md-2 q-my-sm q-py-xs"
            v-model="model.code"
            debounce="500"
            type="text"
            name="code"
            label="Code *"
            v-validate="'max:25|remoteValClientCode:fid'"
            :error="errors.has('code')"
            :error-message="errors.first('code')"
            :readonly="loading"
            dense
            outlined
            autocomplete="off"
          />
          <q-input
            class="col-sm-12 col-md-4 q-my-sm q-py-xs"
            v-model="model.icNumber"
            debounce="500"
            type="text"
            name="icNumber"
            label="Identity Card Number"
            placeholder="Identity Card Number"
            v-validate="'remoteValIc:fid'"
            :error="errors.has('icNumber')"
            :error-message="errors.first('icNumber')"
            :readonly="loading"
            dense
            outlined
            autocomplete="off"
          />
          <q-input
            class="col-sm-12 col-md-6 q-my-sm q-py-xs"
            v-model="model.name"
            type="text"
            name="name"
            label="Name *"
            placeholder="name"
            v-validate="'required|max:50'"
            :error="errors.has('name')"
            :error-message="errors.first('name')"
            :readonly="loading"
            dense
            outlined
            autocomplete="off"
          />
          <q-input
            class="col-sm-12 col-md-12 q-my-sm q-py-xs"
            v-model="model.address"
            type="textarea"
            name="address"
            label="Address"
            placeholder="address"
            v-validate="'max:255'"
            :error="errors.has('address')"
            :error-message="errors.first('address')"
            :readonly="loading"
            dense
            outlined
            autocomplete="off"
            rows="3"
          />
          <q-input
            class="col-sm-12 col-md-4 q-my-sm q-py-xs"
            v-model="model.waPhone"
            type="text"
            name="waPhone"
            label="Whatsapp number"
            placeholder="Whatsapp number"
            v-validate="'max:15|numeric'"
            :error="errors.has('waPhone')"
            :error-message="errors.first('waPhone')"
            :readonly="loading"
            dense
            outlined
            autocomplete="off"
          >
            <template #prepend>
              <q-icon name="la la-whatsapp" color="green" />
            </template>
          </q-input>
          <q-input
            class="col-sm-12 col-md-4 q-my-sm q-py-xs"
            v-model="model.otherPhones"
            type="text"
            name="otherPhones"
            label="Other phones"
            placeholder="Phones"
            v-validate="{ max: 50, regex: /^[0-9\s,-//]*$/ }"
            :error="errors.has('otherPhones')"
            :error-message="errors.first('otherPhones')"
            :readonly="loading"
            dense
            outlined
            autocomplete="off"
          >
            <template #prepend>
              <q-icon name="las la-phone" />
            </template>
          </q-input>
          <q-input
            class="col-sm-12 col-md-4 q-my-sm q-py-xs"
            v-model="model.email"
            type="text"
            name="email"
            label="Email"
            placeholder="email"
            v-validate="'email'"
            :error="errors.has('email')"
            :error-message="errors.first('email')"
            :readonly="loading"
            dense
            outlined
            autocomplete="off"
          >
            <template #prepend>
              <q-icon name="las la-envelope" />
            </template>
          </q-input>
          <q-input
            class="col-sm-12 col-md-12 q-my-sm q-py-xs"
            v-model="model.notes"
            type="textarea"
            name="notes"
            label="Notes"
            placeholder="notes"
            v-validate="'max:255'"
            :error="errors.has('notes')"
            :error-message="errors.first('notes')"
            :readonly="loading"
            outlined
            dense
            rows="3"
          />

          <div class="col-sm-12 text-right">
            <submit-button
              color="white"
              text-color="primary"
              :loading="loading"
              @click="saveClientDetails"
              class=""
            >
              {{ model.id ? "Update" : "SAVE" }}
            </submit-button>
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <div class="row q-mt-md q-col-gutter-sm" v-if="model && model.id">
      <div :class="petContainerClass">
        <client-pets-expansion-card
          :header-class="headerClass"
          :class="expansionClass"
          :style="expansionStyle"
          :clientId="model.id"
          :expanded.sync="petExpanded"
          v-model="selectedPet"
          :patientId="patientId"
        />
      </div>
      <div :class="visitSigContainerClass" v-if="selectedPet && selectedPet.id">
        <div class="column  q-gutter-sm" style="display:block;">
          <div class="col">
            <pet-signalements-expansion-card
              :header-class="headerClass"
              :class="expansionClass"
              :style="expansionStyle"
              :patient="selectedPet"
              :expanded.sync="signalementExpanded"
              v-model="selectedSignalement"
              @open-form="openForm"
              @open-treatment-plan="openTreatmentPlan"
              @open-in-patient-board="openInPatientBoard"
            />
          </div>
        </div>
        <div class="col-xs-12 col-sm-12  col-md-4 col-lg-6 col-xl-6">
          <PetSignalementsCard2
            v-model="selectedSignalement"
            @new-form-added="newFormAdded"
          />
        </div>
        <div></div>
      </div>
    </div>

    <div class="row col-12 q-pt-lg" v-show="selectedPet && selectedPet.id">
      <q-toolbar class="bg-secondary text-white">
        <q-toolbar-title class="text-center">
          Consent forms and In-Patient's summaries
        </q-toolbar-title>
      </q-toolbar>
      <div class="row col-12 q-col-gutter-sm q-pt-sm">
        <div class="col-6">
          <ConsentFormList :patient="selectedPet" @select="selectForm" />
          <keep-alive>
            <ConsentFormDialog
              v-if="signalementAction"
              v-model="formDialog"
              :id="formId"
              :discriminator="discriminator"
              :signalementAction="signalementAction"
            />
          </keep-alive>
        </div>
        <div class="col-6">
          <InPatientBoardList :patient="selectedPet" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import Client from "src/models/Client";
import ClientPetsExpansionCard from "./components/ClientPetsExpansionCard";
import PetSignalementsExpansionCard from "./components/PetSignalementsExpansionCard";
import PetSignalementsCard2 from "./components/PetSignalementsCard2";
import ItemUsageBtn from "../components/ItemUsageBtn";
import ConsentFormList from "./components/ConsentFormList";
import ConsentFormDialog from "./components/ConsentFormDialog";
import BtnMoveClient from "./components/BtnMoveClient";
import InPatientBoardList from "./components/InPatientBoardList";
import ClientAppointmentBtn from "../../components/ClientAppointmentBtn.vue";
export default {
  name: "ClientDetails",
  props: {
    id: {
      type: [Number, String],
      default: () => 0
    },
    patientId: {
      type: [Number, String],
      default: () => undefined
    }
  },
  components: {
    ClientPetsExpansionCard,
    PetSignalementsExpansionCard,
    PetSignalementsCard2,
    ConsentFormList,
    ConsentFormDialog,
    BtnMoveClient,
    InPatientBoardList,
    ItemUsageBtn,
    ClientAppointmentBtn
  },
  data() {
    return {
      loading: false,
      etExpanded: true,
      petExpanded: true,
      signalementExpanded: true,
      headerClass: "bg-white text-primary border-bottom shadow-1",
      expansionClass: "shadow-1 overflow-hidden",
      expansionStyle: "border-radius: 7px;border:1px solid $primary",
      model: undefined,
      client: {},
      selectedPet: {},
      selectedSignalement: {},
      formDialog: false,
      formId: undefined,
      discriminator: undefined,
      signalementAction: undefined,
      onsite: {}
    };
  },
  mounted() {
    if (this.id) {
      if (Number(this.id)) {
        this.reloadClient();
      } else {
        this.model = new Client();
      }
    } else {
      this.model = new Client();
      // this.$router.back();
    }
  },
  watch: {},
  computed: {
    petContainerClass() {
      return "col-sm-12 col-md-4";
      // return this.isAddingPetMode || this.isEditingPetMode > 0
      //   ? "col-xs-12 col-sm-12 col-md-8 col-lg-6 col-xl-6"
      //   : "col-xs-12 col-sm-12 col-md-4 col-lg-4";
    },
    visitSigContainerClass() {
      return "col-sm-12 col-md-8";
      // return this.isAddingPetMode || this.isEditingPetMode > 0
      //   ? "col-xs-12 col-sm-12  col-md-4 col-lg-6 col-xl-6"
      //   : "col-xs-12 col-sm-12 col-md-8 col-lg-8";
    },
    clientDetailsTitle() {
      let cl = this.model;
      return this.clientDetailsExpanded || cl.code === undefined
        ? "Detail client"
        : `${cl.code} ${cl.name}`;
    },
    clientDetailsCaption() {
      let cl = this.model;
      return this.clientDetailsExpanded || cl.code === undefined
        ? ""
        : `${cl.phone} ${cl.email}`;
    }
  },
  methods: {
    async reloadClient() {
      try {
        var res = await this.$api.clients.getOne(this.id);
        if (res.status < 300) {
          this.model = this.client = new Client(res.data);
          this.onsite = res.data.activeOnSite || {};
        } else {
          this.$toastr.error("Unable to fetch client's records");
          this.$router.back();
        }
      } catch (e) {
        // create new record
        this.model = new Client();
        // this.$toastr.error(this.$util.err(e))
      }
    },
    async saveClientDetails() {
      if (!(await this.$validator.validateAll())) {
        this.$toastr.error("Please correct the form then resubmit");
        return;
      }
      if (this.loading) return;
      this.loading = true;

      try {
        let isAdding = !this.model.id || this.model.id === 0;
        var res = await (isAdding
          ? this.$api.clients.post(this.model)
          : this.$api.clients.put(this.model));
        if (res.status < 300) {
          this.$toastr.success(
            `${isAdding ? "Record added" : "Record updated"}`
          );
          if (!this.model.id) {
            this.model = this.client = res.data;
            this.$router.replace("/app/rooms/vet/signalements/" + res.data.id);
          } else {
            this.reloadClient();
          }
        } else {
          this.$toastr.error(res.statusText);
        }
      } catch (e) {
        this.$toastr.error(e);
      } finally {
        this.loading = false;
      }

      this.loading = false;
    },
    newFormAdded(form) {
      this.formId = form.id;
      this.signalementAction = form.signalementAction;
      this.formDialog = true;
    },
    selectForm(form) {
      this.signalementAction = form.signalementAction;
      this.formId = form.id;
      this.formDialog = true;
    },
    openForm(id, signalementAction) {
      this.signalementAction = signalementAction;
      this.formId = id;
      this.formDialog = true;
    },
    openTreatmentPlan(id, signalementAction) {
      this.signalementAction = signalementAction;
      this.formId = id;
      this.formDialog = true;
    },
    openInPatientBoard(id) {
      this.$router.push(
        `/app/rooms/vet/in-patient-treatment-board/signalement/${id}`
      );
    }
  }
};
</script>

<style lang="stylus">
.border-bottom
  border-bottom: 1px solid
</style>
