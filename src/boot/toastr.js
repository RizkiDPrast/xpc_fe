import { Notify } from "quasar";
import { utility } from "./utility";
import store from "src/store";

export default async ({ Vue }) => {
  Notify.setDefaults({
    position: "bottom-right",
    timeout: 2500,
    textColor: "white",
    actions: [{ icon: "las la-times", color: "white" }]
  });

  Vue.prototype.$toastr = {
    error(err) {
      // console.error(err);
      let msg = typeof err === "string" ? err : utility.err(err);
      Notify.create({
        color: "red-5",
        textColor: "white",
        icon: "las la-exclamation-triangle",
        message: `${msg}`
      });

      try {
        store.dispatch("addErrors", utility.errModelState(err));
      } catch (e) {}
    },
    success(msg) {
      Notify.create({
        color: "green-4",
        textColor: "white",
        icon: "las la-check-circle",
        message: msg
      });
    },
    warning(msg) {
      Notify.create({
        color: "secondary",
        textColor: "white",
        icon: "las la-check-circle",
        message: msg
      });
    }
  };
};
