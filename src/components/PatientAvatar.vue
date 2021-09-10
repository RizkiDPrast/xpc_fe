<template>
  <q-avatar
    v-bind="$attrs"
    v-if="value"
    :color="hasAvatar ? 'transparent' : 'secondary'"
    text-color="white"
    class="relative"
  >
    <slot></slot>
    <q-img
      v-if="hasAvatar"
      :src="value.avatar.fileUri"
      spinner-color="secondary"
    />
    <span v-else>{{ getInitials(value.name) }}</span>
  </q-avatar>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasAvatar() {
      let value = this.value;
      if (!value) return false;
      return value.avatar && value.avatar !== null && value.avatar.fileUri;
    }
  }
};
</script>
