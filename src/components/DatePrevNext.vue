<template>
  <q-input
    borderless
    dense
    readonly
    v-model="model"
    :input-class="$attrs['input-class'] + ' text-center non-selectable'"
    class="non-selectable"
    :style="style"
    v-bind="$attrs"
  >
    <template #prepend>
      <q-btn
        :class="iconClass"
        flat
        round
        size="xs"
        icon="las la-chevron-left"
        @click="prev"
      />
    </template>
    <template #append>
      <q-btn
        :class="iconClass"
        flat
        round
        size="xs"
        icon="las la-chevron-right"
        @click="next"
      />
    </template>
  </q-input>
</template>
<script>
export default {
  name: 'DatePrevNext',
  props: {
    value: {
      type: [Date, Number, String],
      default: () => new Date()
    },
    type: {
      type: String,
      default: () => 'day',
      validator: val => ['day', 'month', 'year'].indexOf(val) > -1
    },
    iconClass: {
      type: String,
      default: () => undefined
    }
  },
  data() {
    return {
      tout: undefined,
      modelInput: new Date(this.value)
    };
  },
  computed: {
    model: {
      get() {
        var isYear = this.type === 'year';
        var isMonth = this.type === 'month';
        var format = isYear ? 'YYYY' : isMonth ? 'MMMM, YYYY' : 'MMM, DD YYYY';

        return this.$util.formatDate(this.modelInput, format);
      },
      set(val) {
        this.modelInput = new Date(val);
      }
    },
    style() {
      var isYear = this.type === 'year';
      var isMonth = this.type === 'month';

      return {
        width: isYear ? '100px' : isMonth ? '175px' : '175px'
      };
    }
  },
  watch: {
    value(val) {
      this.modelInput = new Date(val);
    }
  },
  methods: {
    emitInput() {
      this.$emit('input', new Date(this.modelInput));
    },
    prev() {
      // Bug: valid opt days / year / month: should be days / years / months
      // https://quasar.dev/quasar-utils/date-utils#add-subtract
      var opt = { [`${this.type}${this.type === 'day' ? 's' : ''}`]: -1 };
      this.model = this.$util.addToDate(this.modelInput, opt);

      if (this.tout) {
        clearTimeout(this.tout);
      }
      this.tout = setTimeout(() => {
        this.emitInput();
      }, 500);
    },
    next() {
      var opt = { [`${this.type}${this.type === 'day' ? 's' : ''}`]: 1 };
      this.model = this.$util.addToDate(this.modelInput, opt);
      // Bug: valid opt days / year / month: should be days / years / months
      // https://quasar.dev/quasar-utils/date-utils#add-subtract

      if (this.tout) {
        clearTimeout(this.tout);
      }
      this.tout = setTimeout(() => {
        this.emitInput();
      }, 500);
    }
  },
  destroyed() {
    clearTimeout(this.tout);
  }
};
</script>
