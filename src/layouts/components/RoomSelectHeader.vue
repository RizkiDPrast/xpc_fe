<template>
  <q-header>
    <q-toolbar class="" :class="selected.class">
      <user-avatar :value="auth" class="non-selectable cursor-pointer">
        <q-menu :offset="[-50, -50]">
          <q-item>
            <q-item-section side>
              <user-avatar
                v-close-popup
                size="xl"
                :value="auth"
                class="non-selectable  cursor-pointer"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{
                  auth.displayName && auth.displayName !== null
                    ? auth.displayName
                    : auth.userName
                }}
              </q-item-label>
              <q-item-label> {{ auth.roleName || auth.email }} </q-item-label>
            </q-item-section>
          </q-item>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="userDetailDialog = true">
              <q-item-section avatar
                ><q-icon name="la la-pencil-alt"
              /></q-item-section>
              <q-item-section>Edit details</q-item-section>
            </q-item>
            <q-separator />
            <q-item
              clickable
              v-close-popup
              class="text-negative"
              @click="logout"
            >
              <q-item-section avatar
                ><q-icon name="la la-sign-out"
              /></q-item-section>
              <q-item-section class="">LOG OUT</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </user-avatar>
      <user-detail-dialog v-model="userDetailDialog" />
      <!-- <q-toolbar-title class="text-center">
        <q-card-section v-if="selected">
          <div class="text-weight-bold text-uppercase text-h5">
            <q-icon :class="selected.icon" /> {{ selected.label }}
          </div>
          <div class="text-black">
            {{ selected.description }}
          </div>
        </q-card-section>
      </q-toolbar-title> -->
      <q-card-section
        class="row flex-center text-center no-wrap overflow-ellipsis full-width"
      >
        <div v-if="selected">
          <div class="text-weight-bold text-uppercase text-h5">
            <q-icon :class="selected.icon" /> {{ selected.label }}
          </div>
          <div class="text-black">
            {{ selected.description }}
          </div>
        </div>
      </q-card-section>

      <SwitchRoomButton />
      <!-- <q-card-section class="absolute-right">
        
      </q-card-section> -->
    </q-toolbar>
    <slot> </slot>
  </q-header>
</template>
<script>
import SwitchRoomButton from "./SwitchRoomButton";
import UserDetailDialog from "./UserDetailDialog";
export default {
  components: {
    SwitchRoomButton,
    UserDetailDialog
  },
  data() {
    return {
      userDetailDialog: false
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
  watch: {
    // model: {
    //   handler() {
    //     this.$store.commit("app/selectedRoom", this.selected);
    //   },
    //   immediate: true
    // }
  }
};
</script>
