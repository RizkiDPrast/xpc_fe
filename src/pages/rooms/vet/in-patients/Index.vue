<template>
  <div>
    <page-header />
    <q-page>
      <q-toolbar>
        <q-toolbar-title class="text-center"> </q-toolbar-title>
        {{ today() }}
        <q-btn
          flat
          round
          icon="las la-sync"
          @click="fetch"
          :disable="loading"
        />
      </q-toolbar>
      <div class="row">
        <div class="col-4 q-pa-sm" v-for="item in dataModel" :key="item.label">
          <q-card>
            <q-toolbar>
              <q-toolbar-title>
                {{ item.label }}
                <q-item-label caption>
                  {{ item.caption }}
                </q-item-label>
              </q-toolbar-title>
            </q-toolbar>
            <q-list bordered style="min-height:50px;">
              <q-item v-for="model in item.data" :key="model.id">
                <q-item-section avatar top class="q-pr-xs">
                  <patient-avatar :value="model.patient" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ getAnimalTypeName(model.patient.animalTypeId) }} -
                    {{ model.patient.name }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ model.patient.age }} {{ getSexType(model.patient.sex) }}
                  </q-item-label>
                  <q-item-label overline>
                    stay for {{ duration(model.createdAt) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <div>
                    <q-btn
                      flat
                      round
                      :disable="loading"
                      icon="las la-times"
                      @click="del(model.id)"
                      size="sm"
                    />
                    <q-btn icon="las la-ellipsis-v" size="sm" flat round>
                      <q-menu>
                        <q-list>
                          <q-item
                            clickable
                            :to="
                              `/app/rooms/vet/signalements/${model.patient.clientId}/${model.patient.id}`
                            "
                          >
                            <q-item-section>
                              <q-item-label title>
                                Go to details
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
            <q-card-section>
              <q-item-label caption> </q-item-label>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import Patient from "src/models/Patient";
export default {
  data() {
    return {
      loading: false,
      data: []
    };
  },
  computed: {
    dataModel() {
      if (!this.data.length) return [];
      let date = this.$util.formatDate(new Date(), "YYYY-MM-DD");
      let tday = new Date(date);
      let today = this.data.filter(
        x => this.$util.getDateDiff(tday, x.createdAt, "days") === 0
      );
      let yesterday = this.data.filter(
        x => this.$util.getDateDiff(tday, x.createdAt, "days") === 1
      );
      let others = this.data.filter(
        x => this.$util.getDateDiff(tday, x.createdAt, "days") > 1
      );
      return [
        {
          label: "Today",
          caption: `${today.length} patient${today.length > 1 ? "s" : ""}`,
          data: today
        },
        {
          label: "Yesterday",
          caption: `${yesterday.length} patient${
            yesterday.length > 1 ? "s" : ""
          }`,
          data: yesterday
        },
        {
          label: "Older",
          caption: `${others.length} patient${others.length > 1 ? "s" : ""}`,
          data: others
        }
      ];
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
    duration(date) {
      if (!this.$util.isValid(date)) return undefined;
      if (!date) return undefined;

      let days = this.$util.getDateDiff(new Date(), date, "days");
      return `${days} day${days > 1 ? "s" : ""}`;
    },
    async fetch() {
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.onSites.getBoarding();
        this.data = res.data.map(x => {
          x.patient = new Patient(x.patient);
          return x;
        });

        this.$store.commit("app/inPatientCount", this.data.length);
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    },

    async del(id) {
      if (this.loading || !id) return;
      this.loading = true;
      try {
        let res = await this.$api.onSites.delete(id);

        this.data = this.data.filter(x => x.id !== id);
        this.countBoarding();
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    }
  }
};
</script>
