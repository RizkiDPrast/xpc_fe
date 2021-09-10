<template>
  <span>
    <q-btn flat round icon="las la-power-off" @click="dialog = true">
      <q-tooltip>
        Switch room
      </q-tooltip>
    </q-btn>
    <q-dialog v-model="dialog" style="width:500px;max-width:calc(100vh - 25px)">
      <q-card class="full-width">
        <dialog-header title="Switch room" :class="selected.class" />
        <q-card-section
          v-if="loading"
          class="full-width flex flex-center"
          style="height:500px"
        >
          <my-circular-progress
            :color="
              selected.id === 'fd' ? 'light-blue' : 'var(--q-color-accent)'
            "
          >
            Switching room
          </my-circular-progress>
        </q-card-section>
        <q-card-section v-else class="full-width row non-selectable">
          <div v-for="item in rooms" :key="item.id" class="q-pa-md col-12">
            <q-card
              :class="
                item.id !== selected.id
                  ? 'cursor-pointer'
                  : `cursor-not-allowed ${item.class}`
              "
              v-on="
                item.id === selected.id
                  ? null
                  : {
                      click: () => onClick(item.id)
                    }
              "
              :style="item.style"
            >
              <q-card-section class="text-h5">
                <span :class="item.icon"></span> {{ item.label }}
              </q-card-section>
              <q-card-section class="text-subtitle1 text-black">
                {{ item.description }}
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </span>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      dialog: false,
      loading: false
    };
  },
  computed: {
    selected() {
      // return this.rooms.find(x => x.id === this.model);
      return this.$store.state.app.selectedRoom;
    },
    rooms() {
      return this.$store.state.app.rooms;
    }
  },
  mounted() {},
  methods: {
    async onClick(val) {
      if (this.loading) return;
      this.loading = true;
      try {
        // await new Promise(r => {
        //   setTimeout(() => {
        //     r();
        //   }, 3000);
        // });
        this.$q.localStorage.set("defaultRoom", val);
        this.$store.commit(
          "app/selectedRoom",
          this.rooms.find(x => x.id === val)
        );
        await this.$hub.switchRoom(val);

        this.dialog = false;
        this.$toastr.success(
          "Success, You are now working on " +
            this.rooms.find(x => x.id === val).label
        );
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    }
  }
};
</script>
