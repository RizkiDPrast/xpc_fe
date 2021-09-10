<template>
  <q-input
    v-model.number="model"
    disable
    borderless
    v-bind="$attrs"
    type="number"
    input-class="text-center text-bold font-size-md"
    input-style="font-size:3em"
    text-color="red"
  >
    <template #before>
      <q-btn flat unelevated icon="las la-minus" @click="model--" />
    </template>
    <template #after>
      <q-btn flat unelevated icon="las la-plus" @click="model++" />
    </template>
  </q-input>
</template>

<script>
export default {
  name: "quantity-field",
  inheritAttrs: false,
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    validRange(val) {
      return val > 0;
    }
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        if (this.validRange(val)) {
          this.$emit("input", val);
        } else {
          this.$emit("input", this.value);
        }
      }
    }
  }
};
</script>
