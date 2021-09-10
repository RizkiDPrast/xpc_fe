<template>
  <q-btn
    target="_blank"
    flat
    round
    dense
    text-color="negative"
    icon="la la-envelope"
    type="a"
    :href="`mailto://${model}`"
    v-bind="$attrs"
  />
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: () => undefined
    }
  },
  data() {
    return {
      model: this.value
    };
  },
  watch: {
    value(val) {
      this.model = val;
    }
  }
};
</script>
