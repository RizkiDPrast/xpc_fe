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
        <div
          class="col-4 q-pa-sm"
          v-for="item in rooms.filter(x => x.room)"
          :key="item.id"
        >
          <q-card :style="item.style">
            <q-toolbar>
              <q-toolbar-title>
                {{ item.label }}
                <q-item-label caption>
                  {{ item.description }}
                </q-item-label>
              </q-toolbar-title>
              <q-btn
                v-if="item.id.indexOf('fd') === 0 && imHere(item.id)"
                flat
                round
                dense
                icon="las la-plus"
                @click="$router.push('/app/rooms/clients')"
                :disable="loading"
              >
                <q-tooltip>
                  Add visitor
                </q-tooltip>
              </q-btn>
            </q-toolbar>
            <q-list bordered style="min-height:50px;">
              <q-item v-for="model in roomData(item.id)" :key="model.id">
                <q-item-section avatar top class="q-pr-xs">
                  <q-btn flat round icon="las la-user-tie">
                    <q-menu anchor="top right">
                      <q-list class="">
                        <q-item
                          clickable
                          :to="`/app/rooms/sales/client/${model.client.id}`"
                        >
                          <q-item-section>
                            <q-item-label>Create receipt</q-item-label>
                          </q-item-section>
                          <q-item-section avatar>
                            <q-icon name="las la-cash-register" />
                          </q-item-section>
                        </q-item>

                        <q-item
                          clickable
                          :to="
                            `/app/rooms/client-pets/${model.client.id}?date=${model.createdAt}`
                          "
                        >
                          <q-item-section>
                            <q-item-label>Queue details</q-item-label>
                            <q-item-label caption lines="2"
                              >update visitor details or pet's
                              brought</q-item-label
                            >
                          </q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          :to="`vet/signalements/${model.client.id}`"
                        >
                          <q-item-section>
                            <q-item-label>Signalement</q-item-label>
                            <q-item-label caption lines="2"
                              >update visit date, clinical sign /
                              anamnesis</q-item-label
                            >
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                  <div style="margin-top:-12px;margin-left:-3px;">
                    <wa-btn
                      v-if="model.client.waPhone"
                      :value="model.client.waPhone"
                      :disable="loading"
                      size="sm"
                    />
                    <email-btn
                      v-if="model.client.email"
                      :value="model.client.email"
                      :disable="loading"
                      size="sm"
                    />
                  </div>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <q-badge v-if="data && data !== null && data.length">{{
                      data.indexOf(model) + 1
                    }}</q-badge>
                    - {{ model.client.code }} - {{ model.client.name }}
                  </q-item-label>
                  <q-item-label caption>
                    remark: {{ model.remark || "-" }}
                  </q-item-label>
                  <q-item-label
                    v-if="
                      model.patients &&
                        model.patients !== null &&
                        model.patients.length
                    "
                    class="q-gutter-xs"
                  >
                    <q-badge
                      v-for="p in model.patients"
                      :key="p.id"
                      color="grey-3"
                      text-color="black"
                    >
                      <patient-to-boarding-btn
                        :patientId="p.id"
                        size="sm"
                        round
                        color="accent"
                        flat
                      />
                      {{ getAnimalTypeName(p.animalTypeId) }} {{ p.name }}
                    </q-badge>
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
                      v-if="imHere(item.id)"
                      size="sm"
                    />
                    <q-btn
                      flat
                      round
                      text-color="primary"
                      icon="las la-ellipsis-v"
                      :disable="loading"
                      v-if="imHere(item.id)"
                      size="sm"
                    >
                      <q-menu>
                        <!-- <q-toolbar class="bg-grey-3">
                          <q-toolbar-title>
                            Move to:
                          </q-toolbar-title>
                        </q-toolbar> -->
                        <q-list>
                          <q-item
                            v-close-popup
                            v-for="to in otherRooms(item.id)"
                            :key="to.id"
                            clickable
                            @click="move(model, item.id, to.id)"
                          >
                            <q-item-section avatar>
                              <q-icon name="las la-clinic-medical" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>{{ to.label }} </q-item-label>
                            </q-item-section>
                            <q-tooltip> Move to {{ to.label }} </q-tooltip>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
              <!-- <q-item clickable v-ripple v-for="i in 0" :key="i">
              <q-item-section avatar>
                <q-icon color="primary" name="las la-pray" />
              </q-item-section>
              <q-item-section>Icon as avatar</q-item-section>
            </q-item> -->
            </q-list>
            <q-card-section>
              <q-item-label caption>
                Users in room
              </q-item-label>
              <!-- <q-scroll-area style="width: 100%; max-height: 50px;"> -->
              <span
                class="q-pa-sm q-pt-md"
                v-for="(huser, i) in usersInHubRoom(item.id)"
                :key="huser.id"
              >
                <template v-if="i !== 0">, </template>
                <q-badge rounded color="green" v-if="!huser.away" />
                {{
                  huser.displayName && huser.displayName !== null
                    ? huser.displayName
                    : huser.userName
                }}
              </span>
              <!-- </q-scroll-area> -->
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      data: []
    };
  },
  computed: {
    rooms() {
      return this.$store.state.app.rooms;
    },
    hubRoom() {
      return this.$store.state.app.hubRoom;
    },
    imHere() {
      return id => {
        var users = this.usersInHubRoom(id);
        var uname = this.$store.state.auth.userName;
        var user = users.find(x => x.userName === uname);
        return user;
      };
    }
  },
  mounted() {
    this.fetch();
    this.initHubListener();
  },
  methods: {
    async fetch() {
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.onSites.get();
        this.data = res.data;
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    },
    initHubListener() {
      this.$hub.on("clientMoved", this.clientMoved);
    },
    clientMoved(model) {
      if (this.loading) return;
      this.loading = true;
      // console.log("clientMoved", model, this.data);
      if (!this.data.length) return;
      var item = this.data.find(x => x.id === model.id);
      if (!item) return;
      item.room = model.room;
      item.remark = model.remark;
      if (this.imHere(model.room)) {
        this.$toastr.warning(
          `Client ${item.client?.name} queues to ${item.room}`
        );
      }
      this.loading = false;
    },
    async move(model, from, to) {
      if (this.loading) return;
      this.loading = true;
      try {
        let tgt = Object.assign({}, model, {
          room: to,
          remark: `${from} -> ${to} `
        });
        // let res = await this.$api.onSites.put(tgt);
        // console.log(from, to, model.id);
        await this.$hub.moveClient(to, model.id);

        this.data = this.data.map(x => {
          if (x.id === model.id) {
            x.room = tgt.room;
            x.remark = tgt.remark;
          }
          return x;
        });
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
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    },
    roomData(id) {
      if (!id || !this.data.length) return this.data;
      return this.data
        .filter(x => x.room === id)
        .sort((a, b) => (a.id > b.id ? 1 : -1));
    },
    otherRooms(id) {
      return this.rooms.filter(x => x.room && x.id !== id);
    },
    usersInHubRoom(id) {
      if (!this.hubRoom[id]) return [];
      return this.hubRoom[id];
    }
  }
};
</script>
