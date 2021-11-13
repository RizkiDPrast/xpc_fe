import Vue from "vue";
import VueRouter from "vue-router";
import { api } from "../boot/api";
import store from "src/store";

import routes from "./routes";

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function({ store, ssrContext }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  Router.beforeEach(async (to, from, next) => {
    if (to.path) {
      var path = to.path.toLowerCase();
      if (
        path.indexOf("printsales") > -1 ||
        path.indexOf("printdeposit") > -1
      ) {
        next();
        return;
      }
    }
    // first load redirect to login. initLoadScript in Login page
    if (!store.state.app.loaded) {
      if (to.path !== "/") {
        store.commit("returnTo", to);
        next("/");
      } else {
        next();
      }
      return;
    }

    // logged in skip login page or next
    var loggedIn = store.getters["auth/loggedIn"];
    if (loggedIn) {
      if (to.path === "/") {
        next("/app");
      } else {
        next();
      }
      return;
    }

    // not logged in -> redirect to login page
    if (to.path !== "/") {
      next("/");
    } else {
      next();
    }
  });

  return Router;
}
