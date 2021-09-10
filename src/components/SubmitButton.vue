<template>
  <q-btn
    :loading="isLoading"
    type="submit"
    :color="color || 'primary'"
    style="width: 150px"
    @click.stop="$emit('click')"
    v-bind="$attrs"
  >
    <slot>
      Submit
    </slot>

    <template #loading>
      <slot name="loading">
        <q-spinner-ios class="on-left" />
        Loading...
      </slot>
    </template>
  </q-btn>
</template>

<script>
export default {
  name: "SubmitButton",
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: () => "primary"
    }
  },
  data() {
    return {};
  }
};
</script>

<style></style>
