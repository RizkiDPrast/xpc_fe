<template>
  <div>
    Show report
    <q-btn flat :label="label" text-color="primary">
      <q-tooltip content-class="bg-primary">
        Select another month to check?
      </q-tooltip>
      <q-popup-proxy v-model="popup">
        <q-date
          minimal
          v-model="dateModel"
          default-view="Months"
          years-in-month-view
          @navigation="navigation"
        >
        </q-date>
      </q-popup-proxy>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: "MonthBtn",
  props: {
    value: {
      type: [Date, String],
      required: true
    }
  },
  data() {
    return {
      date: new Date(),
      popup: false,
      dateModel: this.date
    };
  },
  methods: {
    navigation(view) {
      var m = Number(this.$util.formatDate(this.date, "M"));
      if (view.month !== m) {
        this.popup = false;
        this.$emit(
          "input",
          new Date(`${view.year}-${view.month.toString().padStart(2, "0")}-01`)
        );
      }
    }
  },
  watch: {
    value(val) {
      this.dateModel = val;
    }
  },
  computed: {
    label() {
      if (!this.dateModel || !this.$util.isValid(this.dateModel)) {
        return "- select month -";
      }
      return this.$util.formatDate(this.dateModel, "MMMM YYYY");
    }
  }
};
</script>
