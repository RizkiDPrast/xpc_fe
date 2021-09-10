<template>
  <q-page>
    <h3>Select Room</h3>
    <transition
      appear
      enter-active-class="animated bounceInUp delay-2s slower"
      leave-active-class="animated bounceOutDown delay-2s slower"
      ><div class="flex flex-center">
        <div v-for="r in rooms" :key="r" class="q-pa-md">
          <q-card>
            <q-toolbar class="bg-accent text-white">
              <q-toolbar-title>
                {{ r }}
              </q-toolbar-title>
            </q-toolbar>
            <q-card-section>
              {{ r }}
            </q-card-section>
          </q-card>
        </div>
      </div>
    </transition>
  </q-page>
</template>

<script>
export default {
  name: "PageIndex",
  data() {
    return {
      rooms: ["FD", "Room I", "Room II", "General"]
    };
  }
};
</script>

<style lang="scss" scoped>
::v-deep .q-card {
  height: 400px;
  width: 300px;
}
</style>
