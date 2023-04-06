<template>
  <div>
    <q-toolbar
      class="my-page-toolbar bg-grey-1"
      style="position:sticky;top:12px;border-radius:25px;"
    >
      <slot name="left-action">
        <q-btn
          flat
          round
          dense
          :icon="mini ? 'las la-window-maximize' : 'las la-window-minimize'"
          @click="toggleDrawer"
        />
      </slot>
      <slot>
        <q-toolbar-title class="text-center">
          {{ title || $route.meta.title }}
        </q-toolbar-title>

        <!-- <closing-button /> -->
        <calendar-btn />
        <slot name="actions">
          <!-- <q-btn flat round dense icon="las la-ellipsis-v" /> -->
        </slot>
      </slot>
    </q-toolbar>
    <validation-summary
      :value="$store.state.errors"
      @input="$store.commit('clearErrors')"
    />
  </div>
</template>
<script>
// import ClosingButton from "./ClosingButton.vue";
export default {
  // components: { ClosingButton },
  name: "page-header",
  props: {
    title: {
      type: String,
      default: () => undefined
    }
  },
  data() {
    return {};
  },
  methods: {
    toggleDrawer() {
      this.$store.commit("app/toggleMiniLeft");
    }
  },
  computed: {
    mini() {
      return this.$store.state.app.miniLeft;
    }
  }
};
</script>
