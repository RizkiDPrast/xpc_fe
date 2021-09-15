<template>
  <div>
    <page-header>
      <template #actions>
        <animal-types-btn flat round />
      </template>
    </page-header>
    <div
      class="q-pa-md"
      style="min-height:calc(100vh - 150px);position:relative"
    >
      <div class="text-h6 q-mb-md">
        <q-btn flat icon="las la-arrow-left" @click="$router.back()" />
        Client and Pets
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-sm-12 col-md-7 q-pa-sm">
          <q-card>
            <q-toolbar class="q-pa-sm">
              <q-toolbar-title>
                Client details:
              </q-toolbar-title>
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

                <submit-button
                  :loading="loading"
                  @click="saveClientDetails"
                  :class="model.id ? 'bg-white text-black' : 'full-width'"
                  :style="model.id ? 'width:50%' : ''"
                >
                  {{ model.id ? "Update" : "Save" }}
                </submit-button>
                <q-btn
                  v-if="model.id"
                  style="width:50%"
                  color="primary"
                  icon="las la-user-tie"
                  label="Add to queue"
                  @click="commitVisitor"
                >
                  <q-tooltip>
                    Add as today's visitor <br />
                    Client:
                    <q-badge class="q-ml-xs">
                      {{ model.code }} - {{ model.name }}
                    </q-badge>
                    <br />
                    <b>Patient</b>:
                    <span v-show="!selectedPets.length" class="text-italic">
                      -No patient brought-
                    </span>
                    <q-badge
                      class="q-ml-xs"
                      v-for="item in selectedPets"
                      :key="item.id"
                    >
                      <q-item-label>
                        {{ getAnimalTypeName(item.animalTypeId) }}
                        {{ item.name }}
                      </q-item-label>
                    </q-badge>
                  </q-tooltip>
                </q-btn>
                <!-- <submit-button
                v-if="model.id"
                :loading="loading"
                @click="commitVisitor"
                style="width:50%"
              >
                Add to queue
              </submit-button> -->
              </q-form>
            </q-card-section>
          </q-card>
        </div>

        <PetsBrought
          class="col-sm-12 col-md-5 q-pa-sm"
          :client="model"
          v-show="model.id"
          :selected-pets.sync="selectedPets"
        />

        <!-- <q-card v-if="model.id > 0" class="q-mt-md col-12">
        <q-toolbar class="q-pa-sm">
          <q-toolbar-title>
            Today's visitor:
          </q-toolbar-title>
        </q-toolbar>
        <q-card-section>
          <b>Client</b>:
          <q-badge class="q-ml-xs">
            {{ model.code }} - {{ model.name }} </q-badge
          ><br />
          <b>Patient</b>:
          <span v-show="!selectedPets.length" class="text-italic">
            -No patient brought-
          </span>
          <q-badge class="q-ml-xs" v-for="item in selectedPets" :key="item.id">
            <q-item-label>
              {{ getAnimalTypeName(item.animalTypeId) }} {{ item.name }}
            </q-item-label>
          </q-badge>
        </q-card-section>
        <q-card-actions>
          <q-btn
            label="Add"
            style="width:50%"
            no-caps
            color="primary"
            @click="commitVisitor"
            :disable="loading"
          />
        </q-card-actions>
      </q-card> -->
      </div>
    </div>
  </div>
</template>

<script>
import Client from "src/models/Client";
import PetsBrought from "./components/PetsBrought";
export default {
  name: "frontdesk-client",
  props: {
    id: {
      type: [Number, String],
      default: () => undefined
    }
  },
  components: {
    PetsBrought
  },
  data() {
    return {
      loading: false,
      model: new Client(),
      selectedPets: []
    };
  },
  mounted() {
    if (this.id) {
      this.reloadClient();
    }
  },
  methods: {
    async reloadClient() {
      try {
        var res = await this.$api.clients.getOne(this.id);
        if (res.status < 300) {
          this.model = this.client = new Client(res.data);
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
        this.$toastr.error("Please fix all errors before submitting");
        return;
      }
      if (this.loading) return;
      this.loading = true;

      try {
        let isAdding = !this.model.id || this.model.id === 0;
        var res = await (isAdding
          ? this.$api.clients.post(this.model)
          : this.$api.clients.put(this.model.id, this.model));
        if (res.status < 300) {
          this.$toastr.success(
            `${isAdding ? "Record added" : "Record updated"}`
          );
          if (res.data && res.data.id) {
            this.model = new Client(res.data);
            // this.$router.replace('/frontdesk/clients/' + res.data.id)
          } else {
            this.reloadClient();
          }
        } else {
          this.$toastr.error(res.statusText);
        }
      } catch (e) {
        this.$toastr.error(e);
      }

      this.loading = false;
    },
    async commitVisitor() {
      if (this.loading) return;
      this.loading = true;
      try {
        if (this.selectedPets.length) {
          await this.$api.onSites.postByPatients(
            this.selectedPets.map(x => x.id)
          );
        } else {
          await this.$api.onSites.postByClient(this.client.id);
        }
        this.$toastr.success("Visitor was added");
        // this.$router.replace("/app/rooms/on-sites");
        this.$router.replace(`/app/rooms/vet/signalements/${this.model.id}`);
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    }
  }
};
</script>
