import Vue from "vue";
import Vuex from "vuex";

import config from "./config";
import app from "./app";
import auth from "./auth";
import list from "./list";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

// export default function(/* { ssrContext } */) {
//   const Store = new Vuex.Store({
//     modules: {
//       config
//     },

//     // enable strict mode (adds overhead!)
//     // for dev mode only
//     strict: process.env.DEBUGGING
//   });

//   return Store;
// }

const store = new Vuex.Store({
  modules: {
    config,
    app,
    auth,
    list
  },
  state: {
    errors: [],
    returnTo: undefined,
    showAppointmentListAt: { atMonth: new Date(), atDate: undefined },
    appointmentId: 0
  },
  actions: {
    addErrors(context, model) {
      context.commit("addErrors", model);
      setTimeout(() => {
        context.commit("clearErrors");
      }, 5000);
    }
  },
  mutations: {
    clearErrors(state) {
      state.errors = [];
    },
    addErrors(state, err) {
      if (err) {
        if (typeof err === "string") {
          if (state.errors.indexOf(err) === -1) {
            state.errors.push(err);
          }
        } else if (Array.isArray(err)) {
          state.errors = Object.assign([], state.errors);
          err.forEach(elm => {
            if (state.errors.indexOf(elm) === -1) {
              state.errors.push(elm);
            }
          });
        }
      }
    },
    returnTo(state, to) {
      state.returnTo = to;
    }
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEBUGGING
});

export default store;
