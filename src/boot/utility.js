import { extend, date, format, copyToClipboard } from "quasar";
import store from "src/store";

export default async ({ Vue }) => {
  Vue.prototype.$util = utility;
};

const {
  formatDate,
  getDateDiff,
  extractDate,
  subtractFromDate,
  addToDate,
  isValid
} = date;
const { capitalize, humanStorageSize } = format;

export const utility = {
  //quasar utilities
  extend,
  formatDate,
  getDateDiff,
  extractDate,
  subtractFromDate,
  addToDate,
  isValid,
  capitalize,
  humanStorageSize,
  copyToClipboard,

  log(...params) {
    if (process.env.DEV) {
      // console.log('[utility.log]', ...params);
    }
  },

  toDateString(val, withDays) {
    if (!val) return "";
    if (!isValid) return val;
    withDays = typeof withDays !== "undefined" ? withDays : true;
    if (withDays) {
      return formatDate(new Date(val), "dddd, D MMM YY");
    } else {
      return formatDate(new Date(val), "DD MMMM YYYY");
    }
  },

  age(val) {
    if (!isValid(val)) return undefined;
    if (!val) return undefined;
    let year = getDateDiff(new Date(), val, "years");
    if (year > 0) return `${year} year${year > 1 ? "s" : ""}`;

    let months = getDateDiff(new Date(), val, "months");
    if (months > 0) return `${months} month${months > 1 ? "s" : ""}`;

    let days = getDateDiff(new Date(), val, "days");
    return `${days} day${days > 1 ? "s" : ""}`;
  },

  toNumber(val) {
    if (!val) return 0;

    if (val.replace) {
      let ns = val.replace(/\./g, "").replace(/,/, "."),
        n = Number(ns);
      if (Number.isNaN(n)) return 0;
      return n;
    }

    return Number(val);
  },

  safeString(model) {
    if (typeof model !== "string") {
      return "";
    }
    return model
      .toString()
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },

  //get error message
  err(e, outputArray) {
    // console.log('err util', e)
    outputArray = outputArray || false;
    let msg = outputArray ? [] : "";
    if (e.response) {
      console.log("errresponse", e.response);
      if (e.response.data && e.response.data.errors) {
        let ms = e.response.data.errors;
        var errs = this.errModelState(e);
        for (var err of errs) {
          if (outputArray) {
            msg.push(err[1]);
          } else {
            msg = msg + ";" + err[1];
          }
        }

        if (!outputArray && msg.indexOf(";") === 0) {
          msg = msg.substr(1);
        }
      } else if (e.response.data && e.response.data.message) {
        if (outputArray) {
          msg.push(e.response.data.message);
        } else {
          msg = e.response.data.message;
        }
      } else if (e.response.data.title) {
        if (outputArray) {
          msg.push(e.response.data.title);
        } else {
          msg = e.response.data.title;
        }
      } else if (
        typeof e.response.data === "string" &&
        e.response.data.length
      ) {
        msg = e.response.data.substr(0,100);
        
        if(e.response.data.length > 100){
          msg += '...'
        }
      } else {
        if (outputArray) {
          msg.push(
            e.response.statusText.toString().length < 100
              ? e.response.statusText
              : "Error occured while contacting to server"
          );
        } else {
          msg =
            e.response.statusText.toString().length < 100
              ? e.response.statusText
              : "Error occured while contacting to server";
        }
      }
    } else if (e.request) {
      // The request was made but no response was received
      // `e.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      if (e.request.data) {
        if (outputArray) {
          msg.push(e.request.data.message);
        } else {
          msg = e.request.data.message;
        }
      } else {
        msg = e.request.message;
        console.log("e.request.message", e.request.message);
      }
    } else if (e.modelState) {
      let ms = e.modelState;
      let errs = this.errModelState(e);
      for (let err of errs) {
        if (outputArray) {
          msg.push(err[1]);
        } else {
          msg = msg + ";" + err[1];
        }
      }

      if (!outputArray && msg.indexOf(";") === 0) {
        msg = msg.substr(1);
      }
    } else if (e.message) {
      if (outputArray) {
        msg.push(e.message);
      } else {
        msg = e.message;
      }
    } else {
      if (outputArray) {
        msg.push(
          e.toString().length < 100
            ? e
            : "Error occured while contacting to server"
        );
      } else {
        msg =
          e.toString().length < 100
            ? e
            : "Error occured while contacting to server";
      }
    }

    return msg;
  },
  errArray(e) {
    return this.err(e, true);
  },
  errModelState(err) {
    if (!err) {
      return "Error";
    }
    let modelState = err.response.data.errors ?? err.response.data.modelState;
    var arr = [];
    if (typeof modelState === "object") {
      for (var k in modelState) {
        if (!Array.isArray(modelState[k])) break;
        arr.push([k, modelState[k][0]]);
      }
    }
    return arr;
  },

  getSexTypes() {
    return store.state.list.sexTypes;
  }
};
