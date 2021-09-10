<template>
  <q-toolbar>
    <q-toolbar-title>
      <slot>
        {{ title }}
      </slot>
    </q-toolbar-title>
    <slot name="actions"> </slot>
    <q-btn round icon="las la-times" flat v-close-popup />
  </q-toolbar>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => "title"
    }
  }
};
</script>
