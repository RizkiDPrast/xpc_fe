<template>
  <q-field v-bind="$attrs" v-model="model">
    <template v-slot:control="{ id, value }">
      <money
        :id="id"
        class="q-field__native q-placeholder text-right"
        :value="value"
        @input="emitValue"
      />
    </template>
    <template v-if="percentToggle" #after>
      <q-btn-toggle no-caps :options="toggleOptions" v-model="toggleModel" />
    </template>
    <template v-for="(_, name) in $slots" v-slot:[name]>
      <slot :name="name" />
    </template>
  </q-field>
</template>

<script>
export default {
  name: "money-field",
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: () => undefined
    },
    percentToggle: {
      type: Boolean,
      default: false
    },
    valuePercent: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      toggleOptions: [
        { label: "%", value: true },
        { label: "B$", value: false }
      ]
    };
  },
  methods: {
    emitValue(val) {
      this.$emit("input", val);
    }
  },
  computed: {
    toggleModel: {
      get() {
        return this.valuePercent;
      },
      set(val) {
        this.$emit("update:value-percent", val);
      }
    },
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>
