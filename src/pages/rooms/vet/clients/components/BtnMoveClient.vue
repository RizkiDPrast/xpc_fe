<template>
  <q-btn
    dense
    round
    flat
    v-if="model && model.id && model.room"
    v-bind="$attrs"
    :loading="loading"
    icon="las la-door-open"
    color="secondary"
  >
    <q-tooltip content-class="bg-secondary">
      Move client
    </q-tooltip>
    <q-menu :offset="[100, 0]">
      <q-list style="min-width: 100px">
        <q-item
          v-for="item in otherRooms"
          :key="item.id"
          clickable
          v-close-popup
          @click="click(item.id)"
        >
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    rooms() {
      return this.$store.state.app.rooms;
    },
    otherRooms() {
      return this.rooms.filter(x => x.room && x.id !== this.model.room);
    }
  },
  methods: {
    async click(to) {
      if (!this.model.id) return;
      if (this.loading) return;
      this.loading = true;
      try {
        await this.$hub.moveClient(to, this.model.id);
        this.model.remark = this.model.room + " > " + to;
        this.model.room = to;
        this.model = Object.assign({}, this.model, {
          remark: this.model.room + " > " + to,
          room: to
        });
        this.$toastr.success(`Client was moved`);
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    }
  }
};
</script>
