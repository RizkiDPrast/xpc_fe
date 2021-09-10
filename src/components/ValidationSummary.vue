<template>
  <transition
    appear
    enter-active-class="animated bounceIn slower"
    leave-active-class="animated fadeOut slower"
  >
    <div v-show="value.length > 0" class="q-px-md q-pt-md">
      <q-banner class="text-white bg-red" dense inline-actions>
        <template v-slot:avatar>
          <q-icon name="las la-exclamation-triangle" color="white" />
        </template>
        <template v-slot:action>
          <q-btn
            flat
            color="white"
            label="Dismiss"
            @click="$emit('input', [])"
          />
        </template>
        <ul
          class="text-left text-italic"
          style="list-style: none;padding-left:0;"
        >
          <li v-for="error in uniqueeErrors" :key="error">
            {{ error }}
          </li>
        </ul>
      </q-banner>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  computed: {
    uniqueeErrors() {
      let err = this.value.filter((val, ix, arr) => arr.indexOf(val) === ix);
      if (err.length > 0 && Array.isArray(err[0])) {
        err = err.map(val => val[1] || val[0]);
      }
      // console.log(err)
      return err;
    }
  },
  mounted() {
    // console.log(1, this.errorMessages.length)
  }
};
</script>
