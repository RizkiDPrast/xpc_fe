<template>
  <div>
    <slot name="label">
      Show report
    </slot>
    <q-btn flat :label="label" text-color="primary">
      <!-- <q-tooltip content-class="bg-primary">
        Select another month to check?
      </q-tooltip> -->
      <q-popup-proxy v-model="popup">
        <q-date
          minimal
          v-model="dateModel"
          :default-view="defaultView"
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
    },
    defaultView: {
      type: String,
      default: () => "Years" // Calendar | Months | Years
    }
  },
  data() {
    return {
      // date: new Date(),
      popup: false,
      dateModel: this.value
    };
  },
  methods: {
    navigation(view) {
      // console.log("navigation", view, this.dateModel, this.defaultView);
      var y = Number(this.$util.formatDate(this.dateModel, "YYYY"));
      var m = Number(this.$util.formatDate(this.dateModel, "M"));
      // if (view.month !== m) {
      //   this.popup = false;
      //   this.$emit(
      //     "input",
      //     new Date(`${view.year}-${view.month.toString().padStart(2, "0")}-01`)
      //   );
      // }
      if (this.defaultView === "Years") {
        if (y !== view.year) {
          this.popup = false;
          this.$emit("input", new Date(`${view.year}-01-01`));
        }
      } else {
        if (m !== view.month) {
          this.popup = false;
          this.$emit(
            "input",
            new Date(
              `${view.year}-${view.month.toString().padStart(2, "0")}-01`
            )
          );
        }
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
        return `- select ${this.defaultView
          .toLowerCase()
          .substring(0, this.defaultView.length - 1)} -`;
      }
      return this.$util.formatDate(
        this.dateModel,
        this.defaultView === "Years" ? "YYYY" : "MMMM YYYY"
      );
    }
  }
};
</script>
