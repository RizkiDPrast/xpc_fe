<template>
  <div v-if="client.id > 0">
    <q-card flat>
      <!-- <div class="text-h6 q-pa-md">
        Patients brought:
      </div> -->
      <q-toolbar class="q-px-md">
        <q-toolbar-title>
          Client's pets:
        </q-toolbar-title>
        <patient-btn
          icon="la la-plus"
          text-color="secondary"
          color="grey-1"
          flat
          round
          :value="newPet"
          :clientId="client.id"
          @input="patientSaved"
        >
          <q-tooltip>
            Add new pet
          </q-tooltip>
        </patient-btn>
      </q-toolbar>
      <div class="row">
        <div v-for="item in data" :key="item.id" class="col-6 q-pa-sm">
          <q-card>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-checkbox
                  :disable="disable(item.id)"
                  dense
                  v-model="petIds"
                  :val="item.id"
                  color="primary"
                  :label="
                    getAnimalTypeName(item.animalTypeId) + ' ' + item.name
                  "
                />
                <q-tooltip content-class="bg-primary">
                  Include in today's visit
                </q-tooltip>

                <q-item-label class="q-pt-sm q-pl-lg" caption v-if="item.doB">
                  {{ item.age }}
                </q-item-label>
              </q-item-section>
            </q-item></q-card
          >
        </div>
        <div
          v-if="!data.length"
          class="text-italic col-12 q-pa-sm self-center text-center"
          style="height:100px;"
        >
          No pet's record available
        </div>
      </div>

      <!-- <q-card v-if="client.id > 0" class="q-mt-md">
      <q-toolbar class="q-pa-sm">
        <q-toolbar-title>
          Today's visitor:
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section>
        <b>Client</b>:
        <q-badge class="q-ml-xs">
          {{ client.code }} - {{ client.name }} </q-badge
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
    </q-card>
  </div>
</template>

<script>
import Client from "src/models/Client";
import Patient from "src/models/Patient";
export default {
  name: "PetsBrought",
  props: {
    client: {
      type: Object,
      default: () => new Client()
    },
    selectedPets: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      data: [],
      petIds: [],
      newPet: new Patient({ clientId: this.client.id }),
      date: undefined,
      visiting: []
    };
  },
  watch: {
    "client.id"(val) {
      this.onRequest();
    },
    petIds(val) {
      let dt = [];
      if (val && val.length) {
        dt = this.data.filter(x => this.petIds.indexOf(x.id) > -1);
      }
      this.$emit("update:selected-pets", dt);
    }
  },
  computed: {
    sexOptions() {
      return this.$util.getSexTypes();
    }
  },
  mounted() {
    var d = this.$route.query.date;
    if (d && this.$util.isValid(d.split(" ")[0])) {
      this.date = new Date(d.split(" ")[0]);
    } else {
      this.date = undefined;
    }
  },
  methods: {
    disable(id) {
      if (!this.date) return false;
      if (this.visiting.indexOf(id) > -1) return true;
      return false;
    },
    async onRequest() {
      if (this.client.id === 0) return;
      this.loading = true;
      try {
        const res = await this.$api.patients.getByClient({
          clientId: this.client.id,
          date: this.date
        });
        let data = res.data
          .map(x => new Patient(x))
          .sort((a, b) => (a.name > b.name ? 1 : -1));
        this.data.splice(0, this.data.length, ...data);

        this.visiting = data.reduce((a, b) => {
          if (b.visitingToday) {
            a.push(b.id);
          }
          return a;
        }, []);
        this.petIds = this.visiting.map(x => x);
      } catch (e) {
        this.$toastr.error(e.message);
      }
      this.loading = false;
    },
    patientSaved(model) {
      var existed = this.data.find(x => x.id === model.id);
      if (existed) {
        this.data = this.data.map(x => (x.id === model.id ? model : x));
      } else {
        this.data.push(model);
      }
    }
  }
};
</script>
