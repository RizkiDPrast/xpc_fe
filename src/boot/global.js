import { api } from "src/boot/api";
import { utility } from "src/boot/utility";
import { config } from "src/boot/money";

import SubmitButton from "../components/SubmitButton.vue";
import ValidationSummary from "../components/ValidationSummary.vue";
import MyCircularProgress from "../components/MyCircularProgress.vue";
import DialogHeader from "components/DialogHeader.vue";
import TdAction from "components/TdAction.vue";
import MyTable from "components/MyTable.vue";
import AnimalTypesBtn from "components/buttons/AnimalTypesBtn.vue";

import PatientBtn from "pages/components/buttons/PatientBtn";
import PatientToBoardingBtn from "components/buttons/PatientToBoardingBtn";

import AnimalTypeSelect from "components/AnimalTypeSelect.vue";
import EdcTypeSelect from "components/EdcTypeSelect.vue";
import SexSelect from "components/SexSelect.vue";
import CategorySelect from "components/CategorySelect.vue";
import UnitSelect from "components/UnitSelect.vue";
import ClientSelect from "components/ClientSelect.vue";
import ProductSelect from "components/ProductSelect.vue";
import UserSelect from "components/UserSelect.vue";

import CategoriesDialog from "components/CategoriesDialog.vue";
import UnitsDialog from "components/UnitsDialog.vue";
import MoneyField from "components/MoneyField.vue";
import UserAvatar from "components/UserAvatar.vue";
import PatientAvatar from "components/PatientAvatar.vue";
import MyFileInput from "components/MyFileInput.vue";
import DateInput from "components/DateInput.vue";
import DateRangeInput from "components/DateRangeInput.vue";
import DatePrevNext from "components/DatePrevNext.vue";
import QuantityField from "components/QuantityField";

import PageHeader from "components/PageHeader.vue";

import WaBtn from "components/buttons/WaBtn.vue";
import EmailBtn from "components/buttons/EmailBtn.vue";
import CalendarBtn from "components/buttons/CalendarBtn.vue";

import UserBadge from "components/badges/UserBadge.vue";
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async (
  { Vue, store, router } /* { app, router, Vue ... } */
) => {
  Vue.filter("money", (val, { prefix = config.prefix } = {}) => {
    if (val === 0) return val;
    if (!val) return "";

    return prefix + fnThousandSeparator(val, val, 2);
  });

  Vue.component("submit-button", SubmitButton);
  Vue.component("validation-summary", ValidationSummary);
  Vue.component("my-circular-progress", MyCircularProgress);
  Vue.component("dialog-header", DialogHeader);
  Vue.component("td-action", TdAction);
  Vue.component("my-table", MyTable);
  Vue.component("animal-types-btn", AnimalTypesBtn);

  Vue.component("patient-btn", PatientBtn);
  Vue.component("patient-to-boarding-btn", PatientToBoardingBtn);

  Vue.component("animal-type-select", AnimalTypeSelect);
  Vue.component("edc-type-select", EdcTypeSelect);
  Vue.component("sex-select", SexSelect);
  Vue.component("category-select", CategorySelect);
  Vue.component("unit-select", UnitSelect);
  Vue.component("client-select", ClientSelect);
  Vue.component("product-select", ProductSelect);
  Vue.component("quantity-field", QuantityField);
  Vue.component("user-select", UserSelect);

  Vue.component("categories-dialog", CategoriesDialog);
  Vue.component("units-dialog", UnitsDialog);
  Vue.component("money-field", MoneyField);
  Vue.component("user-avatar", UserAvatar);
  Vue.component("patient-avatar", PatientAvatar);
  Vue.component("my-file-input", MyFileInput);
  Vue.component("date-input", DateInput);
  Vue.component("date-range-input", DateRangeInput);
  Vue.component("date-prev-next", DatePrevNext);

  Vue.component("page-header", PageHeader);

  Vue.component("wa-btn", WaBtn);
  Vue.component("email-btn", EmailBtn);
  Vue.component("calendar-btn", CalendarBtn);

  Vue.component("user-badge", UserBadge);

  Vue.mixin({
    computed: {
      auth() {
        return store.state.auth;
      },
      roles() {
        return store.state.list.roles;
      },
      isAdmin() {
        return (
          store.state.auth.userName &&
          store.state.auth.role.toLowerCase() == "admin"
        );
      },
      isFinance() {
        return (
          store.state.auth.userName &&
          store.state.auth.role.toLowerCase() == "finance"
        );
      },
      isVet() {
        return (
          store.state.auth.userName &&
          store.state.auth.role.toLowerCase() == "veterinarian"
        );
      },
      isParamedic() {
        return (
          store.state.auth.userName &&
          store.state.auth.role.toLowerCase() == "paramedic"
        );
      },
      where() {
        return (
          this.$store.state.app.selectedRoom &&
          this.$store.state.app.selectedRoom.id
        );
      },
      isGroomer() {
        return (
          store.state.auth.userName &&
          store.state.auth.role.toLowerCase() == "groomer"
        );
      },
      units() {
        return this.$store.state.list.units;
      },
      categories() {
        return this.$store.state.list.categories;
      },
      years() {
        let td = new Date().getFullYear();
        let data = [],
          ty = 2021;
        for (let i = 0; i < 10; i++) {
          data.push(ty++);
          if (ty > td) {
            break;
          }
        }
        return data;
      }
    },
    methods: {
      printHtml(htmlContent) {
        var w = window.open("", "_blank", "toolbar=0,location=0,menubar=0");
        w.document.write(htmlContent);
        w.document.close();
        w.focus();
        w.print();
        // w.close();
      },
      async countBoarding() {
        try {
          let res = await this.$api.onSites.getBoardingCount();
          this.$store.commit("app/inPatientCount", res.data || 0);
          this.$hub.updateBoardingCount(res.data || 0);
        } catch (error) {
          this.$toastr.error(error);
        }
      },
      async confirm(message, opt) {
        opt = opt || {};
        opt = Object.assign(
          {},
          {
            ok: {
              label: "Ok",
              color: "primary"
            },
            cancel: {
              label: "Cancel",
              color: "grey"
            }
          },
          opt
        );
        return new Promise(resolve => {
          this.$q
            .dialog({
              title: "Confirmation",
              message,
              cancel: true,
              persistent: true,
              html: true,
              ...opt
            })
            .onOk(() => {
              resolve(true);
            })
            .onCancel(() => {
              resolve(false);
            });
        });
      },
      today() {
        return utility.formatDate(new Date(), "dddd, DD MMM YYYY");
      },
      async logout() {
        await api.auth.logout();
        store.commit("auth/logout");
        router.replace("/login");
      },
      getAppointment(id) {
        let data = store.state.list.appointmentTypes;
        if (id === undefined || data.length === 0) {
          return "";
        }
        var model = data.find(x => x.id === id) || {};
        return model;
      },
      getEdcTypeName(id) {
        let data = store.state.list.edcTypes;
        if (id === undefined || data.length === 0) {
          return "";
        }
        var model = data.find(x => x.id === id) || {};
        return model.label;
      },
      getAnimalType(id) {
        let data = store.state.list.animalTypes;
        if (id === undefined || data.length === 0) {
          return "";
        }
        var model = data.find(x => x.id === id) || {};
        return model;
      },
      getAnimalTypeName(id) {
        let data = store.state.list.animalTypes;
        if (id === undefined || data.length === 0) {
          return "";
        }
        var model = data.find(x => x.id === id) || {};
        return model.name;
      },
      getCategoryName(id) {
        let data = store.state.list.categories;
        if (id === undefined || data.length === 0) {
          return "";
        }
        var model = data.find(x => x.id === id) || {};
        return model.name;
      },
      getUnitName(id) {
        let data = store.state.list.units;
        if (id === undefined || data.length === 0) {
          return "";
        }
        var model = data.find(x => x.id === id) || {};
        return model.name;
      },
      getSexType(id) {
        let data = store.state.list.sexTypes;
        if (id === undefined || data.length === 0) {
          return "";
        }
        var model = data.find(x => x.id === id) || {};
        return model.name;
      },
      getInitials(name) {
        if (!name || name == null) return "";
        var arr = name
          .replaceAll("  ", " ")
          .trim()
          .split(" ", 2);
        if (arr.length == 0) return "";
        if (arr.length > 1) return `${arr[0][0]}${arr[1][0]}`.toUpperCase();
        return `${arr[0][0]}`.toUpperCase();
      },
      generateFormData(obj) {
        if (!obj || obj == null || typeof obj !== "object") return null;
        var fd = new FormData();
        for (let k in obj) {
          if (k === "createdAt" || k === "modifiedAt") {
            continue;
          }
          if (obj[k]) {
            if (k.getMilliseconds) {
              fd.append(k, JSON.parse(JSON.stringify(obj[k])));
            } else {
              fd.append(k, obj[k]);
            }
          }
        }
        return fd;
      },
      nullable(str) {
        if (!str || str === null || str.trim() === "") {
          return "-";
        }
        return str;
      },
      printSalesProtocol(id) {
        var host = `${location.protocol}//${location.host}`;
        this.printViaCustomProtocol(`${host}/printSales/${id}`);
      },
      printDepositProtocol(id) {
        var host = `${location.protocol}//${location.host}`;
        this.printViaCustomProtocol(`${host}/printDeposit/${id}`);
      },
      printViaCustomProtocol(url, protocol) {
        protocol = protocol || "posprinter://";
        var n = window.open(`${protocol}${url}`, "__blank");
        setTimeout(() => {
          if (n) {
            n.close();
          }
        }, 1000);
      }
    },
    mounted() {}
  });
};

function fnThousandSeparator(amount, oldAmount, scale) {
  scale = Number(scale) > -1 ? Number(scale) : 2;
  if (
    amount !== "" &&
    amount !== undefined &&
    amount !== 0 &&
    amount !== "0" &&
    amount !== null
  ) {
    if (/(<=[.]),/.test(amount)) return oldAmount;
    var nAmount = amount.toString().replace(/,/g, "");
    if (isNaN(Number(nAmount))) return oldAmount;

    let pat = /\B(?=(\d{3})+(?!\d))/g;
    if (
      nAmount.indexOf(".") > -1 &&
      nAmount.indexOf(".") !== nAmount.length - 1
    ) {
      if (nAmount.substr(nAmount.indexOf(".") + 1).length > scale)
        nAmount = Number(nAmount)
          .toFixed(scale)
          .toString();
      var lpart = nAmount.substr(0, nAmount.indexOf(".") + 1);
      var rpart = nAmount.substr(nAmount.indexOf(".") + 1);
      return lpart.replace(pat, ",") + "" + rpart;
    }
    const resString = nAmount.replace(pat, ",");
    return resString;
  } else {
    return amount;
  }
}
