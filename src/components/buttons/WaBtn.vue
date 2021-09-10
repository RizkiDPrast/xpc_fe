<template>
  <q-btn
    v-if="model && model !== null && model.length"
    target="_blank"
    flat
    round
    dense
    text-color="green"
    icon="la la-whatsapp"
    type="a"
    :href="`https://wa.me/+${model}`"
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
