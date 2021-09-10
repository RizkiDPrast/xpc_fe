<template>
  <div id="app">
    <ValidationProvider ref="provider" rules="required" v-slot="{ errors }">
      <!-- <input v-model="model" type="text" />
      <div v-if="errors" v-text="errors[0]"></div> -->
      <q-file
        :error="!!errors.length"
        :error-message="errors[0]"
        v-bind="$attrs"
        v-on="$listeners"
        @rejected="onRejected"
        @input="input"
      >
        <template v-slot:prepend>
          <q-icon name="las la-paperclip" />
        </template>
      </q-file>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";
export default {
  inheritAttrs: false,
  components: {
    ValidationProvider
  },
  data() {
    return {};
  },
  methods: {
    onRejected(rejectedEntries) {
      let error = "File validation failed";
      if (rejectedEntries.length) {
        var p = rejectedEntries[0].failedPropValidation;
        var file = rejectedEntries[0].file;
        error =
          ` [${p}] ` +
          error +
          ` for ${file.name} | ${this.$util.humanStorageSize(file.size)} |` +
          file.type;
      }
      this.$refs.provider.applyResult({
        errors: [error], // array of string errors
        valid: false, // boolean state
        failedRules: {} // should be empty since this is a manual error.
      });
    },
    input() {
      this.$refs.provider.reset();
    }
  }
};
</script>
