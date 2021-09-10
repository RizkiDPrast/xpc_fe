import VeeValidate, { Validator } from "vee-validate";
import { instance as axios } from "./axios";
import { utility } from "./utility";
import { api } from "./api";

// "async" is optional
let $store;

//define customRules
//remote validation
export default ({ Vue, store }) => {
  $store = store;

  const remoteValClientCode = {
    getMessage(field, params, data) {
      return (data && data.message) || "Something went wrong";
    },
    validate(v1, v2) {
      return new Promise(async (resolve, reject) => {
        if (Array.isArray(v2) && v2.length > 0) {
          v2 = v2[0];
        }
        var res = await api.clients.validateCode(v1, v2);
        if (res.status > 300) {
          resolve({ valid: false, data: { message: utility.err(res) } });
        }

        if (typeof res.data === "string") {
          resolve({ valid: false, data: { message: res.data } });
        } else {
          resolve({ valid: res.data, data: { message: "" } });
        }
      });
    }
  };

  const remoteValIc = {
    getMessage(field, params, data) {
      return (data && data.message) || "Something went wrong";
    },
    validate(v1, v2) {
      return new Promise(async (resolve, reject) => {
        if (Array.isArray(v2) && v2.length > 0) {
          v2 = v2[0];
        }
        var res = await api.clients.validateIc(v1, v2);
        if (res.status > 300) {
          resolve({ valid: false, data: { message: utility.err(res) } });
        }

        if (typeof res.data === "string") {
          resolve({ valid: false, data: { message: res.data } });
        } else {
          resolve({ valid: res.data, data: { message: "" } });
        }
      });
    }
  };
  const remoteValSku = {
    getMessage(field, params, data) {
      return (data && data.message) || "Something went wrong";
    },
    validate(v1, v2) {
      return new Promise(async (resolve, reject) => {
        if (Array.isArray(v2) && v2.length > 0) {
          v2 = v2[0];
        }
        var res = await api.products.validateSku(v1, v2);
        if (res.status > 300) {
          resolve({ valid: false, data: { message: utility.err(res) } });
        }

        if (typeof res.data === "string") {
          resolve({ valid: false, data: { message: res.data } });
        } else {
          resolve({ valid: res.data, data: { message: "" } });
        }
      });
    }
  };

  const trueFalse = {
    getMessage(field, params, data) {
      return (data && data.message) || "This field is required";
    },
    validate(val) {
      // console.log("validate", val);
      return typeof val === "undefined" || val === null ? false : true;
    }
  };

  Validator.extend("remoteValClientCode", remoteValClientCode, {
    hasTarget: true,
    immediate: false
  });
  Validator.extend("remoteValIc", remoteValIc, {
    hasTarget: true,
    immediate: false
  });
  Validator.extend("remoteValSku", remoteValSku, {
    hasTarget: true,
    immediate: false
  });

  Validator.extend("requiredTrueFalse", trueFalse);

  Vue.use(VeeValidate);
};
