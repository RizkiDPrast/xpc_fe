<template>
  <q-select
    use-input
    v-bind="$attrs"
    input-debounce="500"
    v-model="selected"
    :options="data"
    :loading="isLoading"
    @filter="filterFn"
    clearable
    autocomplete="off"
    immediate
  />
</template>

<script>
export default {
  name: 'client-select',
  inheritAttrs: false,
  props: {
    value: {
      type: Number,
      default: () => undefined
    }
  },
  data () {
    return {
      data: [],
      originalData: [],
      isLoading: false
    }
  },
  mounted () {
    this.fetch()
  },
  computed: {
    selected: {
      get () {
        if (!this.value || !this.data.length) {
          return undefined
        }
        return this.data.find(x => x.id === this.value)
      },
      set (val) {
        if (val && val.value) {
          this.$emit('input', val.id)
          this.$emit('selected', val)
        } else {
          this.$emit('input', undefined)
          this.$emit('selected', {})
        }
      }
    },
    
  },
  watch:{
      value(){
        this.fetch()
      }
    },
  methods: {
    async fetch (filter) {
      if (this.isLoading) return
      this.isLoading = true
      try {
        const res = await this.$api.selectDatas.clients({ filter: filter || '', take: 10, Id: this.value })
        let data = res.data
        if (Array.isArray(data)) {
          data = data.map(x => ({ ... x, value: x.id, label: `${x.code} - ${x.name}`}))
          this.data.splice(0, this.data.length, ...data)
          if (this.value) {
            this.selected = this.data.find(x => x.id === this.value) || undefined
          }
        } else {
          if (res.data.id) {
            this.data = [res.data]
            if (this.value === res.data.id) {
              res.data.value =res.data.id;
              res.data.label = `${res.data.code} - ${res.data.name}`
              this.selected = res.data;
              this.data = [res.data]
            }
          }
        }
      } catch (e) {
        this.$toastr.error(e.message)
      }
      this.isLoading = false
    },
    filterFn (val, update) {
      update(() => {
        this.fetch(val)
      })
    }
  }
}
</script>

<style></style>
