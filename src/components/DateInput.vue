<template>
  <q-input outlined readonly v-model="model" v-bind="$attrs">
    <template #append>
      <q-btn
        v-if="model"
        dense
        size="xs"
        flat
        icon="las la-times"
        @click="model = null"
      />
      <q-icon name="las la-calendar-day" class="cursor-pointer">
        <q-popup-proxy
          ref="qDateProxy"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            mask="YYYY-MM-DD"
            v-model="model"
            @input="closePopup('qDateProxy')"
            today-btn
            :readonly="readonly"
            v-on="$listeners"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Date, Number],
      default: () => undefined
    }
  },
  computed: {
    model: {
      get() {
        return this.$util.formatDate(this.value, "YYYY-MM-DD");
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    readonly() {
      let val = this.$attrs["readonly"];
      return val === "" ? true : val || false;
    }
  },
  methods: {
    closePopup(ref) {
      this.$refs[ref].hide();
    }
  }
};
</script>
