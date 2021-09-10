<template>
  <div class="row">
    <div class="col-3">
      Pick date ranges:
    </div>
    <div class="col-4">
      <date-input v-model="date1" v-bind="$attrs" outlined label="From" stack-label />
    </div>
    <div class="col-1 text-center">-</div>
    <div class="col-4">
      <date-input v-model="date2" v-bind="$attrs" outlined label="To" stack-label :disable="!date1" :options="date2Options" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateRangeInput',
  inheritAttrs: false,
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dateFormat: 'YYYY/MM/DD'
    }
  },
  computed: {
    date1: {
      get () {
        return !this.value.length ? undefined : this.value.reduce((a, b) => a > b ? b : a)
      },
      set (val) {
        var arr = [this.$util.formatDate(val, this.dateFormat)]
        if (this.value.length > 1) {
          arr.push(this.value[1])
        }
        this.$emit('input', arr)
      }
    },
    date2: {
      get () {
        return this.value.length < 2 ? undefined : this.value.reduce((a, b) => a > b ? a : b)
      },
      set (val) {
        var arr = []
        var d2 = this.$util.formatDate(val, this.dateFormat)
        if (this.value.length) {
          arr.push(this.value[0])
        } else {
          arr.push(d2)
        }
        arr.push(d2)
        this.$emit('input', arr)
      }
    }
  },
  methods: {
    date2Options (val) {
      return val >= this.date1
    }
  }
}
</script>
