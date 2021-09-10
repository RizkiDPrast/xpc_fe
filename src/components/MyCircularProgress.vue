<template>
  <q-circular-progress
    key="loader"
    class="text-light-blue q-ma-md"
    :size="$attrs.size || '60px'"
    :color="color"
    indeterminate
    v-bind="$attrs"
  />
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: () => "light-blue"
    }
  }
};
</script>
