import { instance as axios } from "../boot/axios";
import store from "../store";
import AnimalType from "src/models/AnimalType";
import Category from "src/models/Category";
import Unit from "src/models/Unit";
import AppointmentType from "src/models/AppointmentType";

// "async" is optional
export default async ({ Vue, store }) => {
  axios.interceptors.request.use(
    function(config) {
      let selected = store.state.app.selectedRoom.id;
      if (selected) {
        config.headers["X-Room"] = selected;
        // console.log("config header", selected, config);
      }
      return config;
    },
    function(error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  Vue.prototype.$api = api;
};

const response = obj => {
  return new Promise(resolve => {
    resolve({
      status: 200,
      data: obj
    });
  });
};

export const api = {
  auth: {
    get() {
      return axios.get("auth/LoginState");
    },
    login(model) {
      return axios.post("auth/login", model);
    },
    logout() {
      return axios.post("auth/logout");
    },
    put: model => {
      return axios.put("auth/updateDetails", model);
    }
  },
  selectDatas: {
    clients: params => axios.get("selectdatas/Clients", { params }),
    users: params => axios.get("selectdatas/users", { params }),
    products: params => axios.get("selectdatas/products", { params }),
    suppliers: params => axios.get("selectdatas/suppliers", { params })
    // insentiveModels: async () => {
    //   var data = store.state.list.insentiveModels;
    //   if (!data.length) {
    //     let res = await axios.get(`/selectdatas/InsentiveModels`);
    //     if (res.status < 300) {
    //       data = res.data;
    //       store.commit("list/setInsentiveModels", res.data);
    //     }
    //   }
    //   return response(data);
    // }
  },
  clients: {
    get(params) {
      return axios.get("clients", { params });
    },
    getOne(id) {
      return axios.get(`clients/${id}`);
    },
    post(params) {
      return axios.post("clients", params);
    },
    put(params) {
      return axios.put("clients", params);
    },
    delete(params) {
      return axios.delete("clients", params);
    },
    validateCode(code, id) {
      return axios.get("clients/validate/code", { params: { code, id } });
    },
    validateIc(icNumber, id) {
      return axios.get("clients/validate/icNumber", {
        params: { icNumber, id }
      });
    }
  },
  appointmentTypes: {
    get: async pager => {
      const data = store.state.list.appointmentTypes;
      if (data.length) {
        return response(data);
      }
      let res = await axios.get("/appointmentTypes");
      if (res.status < 300) {
        store.commit("list/setAppointmentTypes", res.data.rows);
      }
      return response(res.data.rows);
    },
    getOne: id => axios.get(`/appointmentTypes/${id}`),
    post: async params => {
      let res = await axios.post("/appointmentTypes", params);
      if (res.status < 300) {
        var data = store.state.list.appointmentTypes.map(x => x);
        data.push(new AppointmentType(params));
        store.commit("list/setAppointmentTypes", data);
      }
      return res;
    },
    put: async params => {
      let res = await axios.put(`/appointmentTypes/`, params);
      if (res.status < 300) {
        var data = store.state.list.appointmentTypes.map(x =>
          x.id === params.id ? new AppointmentType(params) : x
        );
        store.commit("list/setAppointmentTypes", data);
      }
      return res;
    },
    delete: async id => {
      let res = await axios.delete(`/appointmentTypes/${id}`);
      if (res.status < 300) {
        var data = store.state.list.appointmentTypes.filter(x => x.id !== id);
        store.commit("list/setAppointmentTypes", data);
      }
      return res;
    }
  },
  appointments: {
    get: params => {
      return axios.get("Appointments", {
        params
      });
    },
    getOne: id => {
      return axios.get("/appointments/Details", {
        params: {
          id
        }
      });
    },
    put: model => {
      return axios.put(`appointments/`, model);
    },
    post: params => {
      return axios.post("/appointments", params);
    },
    delete: id => {
      return axios.delete(`/appointments/${id}`);
    },
    calendarEvents: params => {
      return axios.get("/appointments/CalendarEvents", {
        params
      });
    },
    getByClient: params => {
      return axios.get("/appointments/ByClient", {
        params
      });
    },
    getCount: () => {
      return axios.get("Appointments/GetCount");
    }
  },
  animalTypes: {
    get: async pager => {
      const animals = store.state.list.animalTypes;
      if (animals.length) {
        return response(animals);
      }
      let res = await axios.get("/animalTypes");
      if (res.status < 300) {
        store.commit("list/setAnimalTypes", res.data.rows);
      }
      return response(res.data.rows);
    },
    getOne: id => axios.get(`/animalTypes/${id}`),
    post: async params => {
      let res = await axios.post("/animalTypes", params);
      if (res.status < 300) {
        var data = store.state.list.animalTypes.map(x => x);
        data.push(new AnimalType(res.data));
        store.commit("list/setAnimalTypes", data);
      }
      return res;
    },
    put: async params => {
      let res = await axios.put(`/animalTypes/`, params);
      if (res.status < 300) {
        var data = store.state.list.animalTypes.map(x =>
          x.id === params.id ? new AnimalType(params) : x
        );
        store.commit("list/setAnimalTypes", data);
      }
      return res;
    },
    delete: async id => {
      let res = await axios.delete(`/animalTypes/${id}`);
      if (res.status < 300) {
        var data = store.state.list.animalTypes.filter(x => x.id !== id);
        store.commit("list/setAnimalTypes", data);
      }
      return res;
    }
  },

  patients: {
    get: params => axios.get("/patients", { params }),
    getByClient: params => axios.get("/patients/byclient", { params }),
    getOne: id => axios.get(`/patients/${id}`),
    post: params => axios.post("/patients", params),
    put: params => axios.put(`/patients`, params),
    delete: id => axios.delete(`/patients/${id}`),
    getSelectDataByClient: async clientId => {
      var data = store.state.list.patientsByClient[clientId];
      if (!data || !data.length) {
        let res = await axios.get(`/patients/byclient`, {
          params: { clientId }
        });
        if (res.status < 300) {
          data = res.data;
          store.commit("list/setPatientsByClient", res.data);
        }
      }
      return response(data);
    }
  },
  signalements: {
    get: id => axios.get(`/signalements/bypatient/${id}`),
    getOne: id => axios.get(`/signalements/${id}`),
    post: params => axios.post("/signalements", params),
    putVisit: params => axios.put(`/signalements/visit-vital-signs`, params),
    putSignalement: params => axios.put(`/signalements/medical-record`, params),
    delete: id => axios.delete(`/signalements/${id}`),
    getAttachments: id => axios.get(`/signalements/${id}/Attachments`),
    uploadAttachment: (id, file) =>
      axios.post(`/signalements/${id}/Attachments`, file),
    deleteAttachment: ({ signalementId, id }) =>
      axios.delete(`signalements/${signalementId}/attachments/${id}`)
  },
  onSites: {
    get: () => axios.get("onSites"),

    getBoardingCount: () => axios.get("onSites/boarding/count"),
    getBoarding: () => axios.get("onSites/boarding"),
    postBoarding: pid => axios.post(`onSites/boarding/${pid}`),

    postByClient: clientId => axios.post("/onsites/byClient", clientId),
    postByPatients: patientIds => axios.post("/onsites/byPatients", patientIds),
    put: model => axios.put("/onsites", model),
    delete: id => axios.delete(`/onsites/${id}`)
  },
  reports: {
    getVisit: date => axios.get(`/reports/visit`, { params: { date } }),
    getSalesMonth: date =>
      axios.get(`/reports/monthly-sales`, { params: { date } })
  },
  categories: {
    get: async pager => {
      const model = store.state.list.categories;
      if (model.length) {
        return response(model);
      }
      let res = await axios.get("/categories", { params: pager });
      if (res.status < 300) {
        store.commit("list/setCategories", res.data.rows);
      }
      return response(res.data.rows);
    },
    getOne: id => axios.get(`/categories/${id}`),
    post: async params => {
      let res = await axios.post("/categories", params);
      if (res.status < 300) {
        var data = store.state.list.categories.map(x => x);
        data.push(new Category(res.data));
        store.commit("list/setCategories", data);
      }
      return res;
    },
    put: async params => {
      let res = await axios.put(`/categories`, params);
      if (res.status < 300) {
        var data = store.state.list.categories.map(x =>
          x.id === params.id ? new Category(params) : x
        );
        store.commit("list/setCategories", data);
      }
      return res;
    },
    delete: async id => {
      let res = await axios.delete(`/categories/${id}`);
      if (res.status < 300) {
        var data = store.state.list.categories.filter(x => x.id !== id);
        store.commit("list/setCategories", data);
      }
      return res;
    }
  },
  units: {
    get: async () => {
      const model = store.state.list.units;
      if (model.length) {
        return response(model);
      }
      let res = await axios.get("/units");
      if (res.status < 300) {
        store.commit("list/setUnits", res.data.rows);
      }
      return response(res.data.rows);
    },
    getOne: id => axios.get(`/units/${id}`),
    post: async params => {
      let res = await axios.post("/units", params);
      if (res.status < 300) {
        var data = store.state.list.units.map(x => x);
        data.push(new Unit(res.data));
        store.commit("list/setUnits", data);
      }
      return res;
    },
    put: async params => {
      let res = await axios.put(`/units`, params);
      if (res.status < 300) {
        var data = store.state.list.units.map(x =>
          x.id === params.id ? new Unit(params) : x
        );
        store.commit("list/setUnits", data);
      }
      return res;
    },
    delete: async id => {
      let res = await axios.delete(`/units/${id}`);
      if (res.status < 300) {
        var data = store.state.list.units.filter(x => x.id !== id);
        store.commit("list/setUnits", data);
      }
      return res;
    }
  },
  products: {
    get: (discontinued, pager) =>
      axios.get("/products", {
        params: {
          discontinued,
          ...pager
        }
      }),
    getOne: id => axios.get(`/products/${id}`),
    post: params => axios.post("/products", { ...params }),
    put: (id, params) => axios.put(`/products/${id}`, { ...params }),
    delete: id => axios.delete(`/products/${id}`),
    validateSku: (v1, v2) => {
      return axios.get("products/validateSku", {
        params: { sku: v1, id: v2 || 0 }
      });
    },
    postUnit: model => axios.post("/productUnits", model),
    putUnit: model => axios.put("/productUnits", model),
    deleteUnit: id => axios.delete("/productUnits", { params: { id } }),
    updateInvStatus: model =>
      axios.post("/products/updateTrackInvStatus", model)
  },
  users: {
    get: params => {
      return axios.get("users", { params });
    },
    getOne: id => {
      return axios.get(`users/${id}`);
    },
    put: model => {
      return axios.put("users", model);
    },
    post: model => {
      return axios.post("users", model);
    },
    delete: id => {
      return axios.delete(`users/${id}`, {
        params: {}
      });
    },
    changePassword: model => {
      return axios.put("users/ChangePassword", model);
    },
    removeLockout(id) {
      return axios.put(`users/removeLockout/${id}`);
    }
  },
  stocks: {
    get: params => axios.get("/stockJournals", { params }),
    postJournal: params => axios.post("/stockJournals", params),
    postHistory: () => axios.post("/stockOpnames"),
    getHistory: params => axios.get("/stockOpnames", { params }),
    getHistoryData: params => axios.get("/stockOpnames/datas", { params })
  },

  purchases: {
    get: params => axios.get("/purchases", { params }),
    getOne: id => axios.get(`/purchases/${id}`),
    post: params => axios.post("/purchases", { ...params }),
    put: (id, params) => axios.put(`/purchases/${id}`, { ...params }),
    delete: id => axios.delete(`/purchases/${id}`)
  },
  purchaseLines: {
    getPurchaseCode: id => axios.get(`/purchaseLines/${id}/PurchaseCode`)
  },
  sales: {
    get: params => axios.get("/sales", { params }),
    getOne: id => axios.get("/sales/" + id),
    getClientUnpaids: id => axios.get(`/sales/unpaid/client/${id}`),
    getUnpaid: () => axios.get("/sales/unpaid"),
    getToday: () => {
      let res = axios.get("/sales/today");
      return res;
    },
    post: params => axios.post("/sales", { ...params }),
    closing: model => axios.post("/salesmanagers", model),
    // getOne: (id) => axios.get(`/units/${id}`),
    put: (id, params) => axios.put(`/sales/${id}`, { ...params })
    // delete: (id) => axios.delete(`/units/${id}`)
  },
  unfinishedItems: {
    getUntransferred: () => axios.get("UnfinishedItems/untransferred"),
    getUnpaidSaleLine: () => axios.get("UnfinishedItems/unpaidSaleLine")
  },
  salesManagers: {
    get: params => axios.get("/salesmanagers", { params }),
    getDetails: id => axios.get(`/salesmanagers/${id}`)
  },
  saleLines: {
    getBySales: salesId => axios.get("/saleLines", { params: { salesId } })
    // getOne: (id) => axios.get(`/units/${id}`),
    // put: (id, params) => axios.put(`/units/${id}`, { ...params }),
    // delete: (id) => axios.delete(`/units/${id}`)
  },
  itemUsages: {
    get: params => axios.get("itemusages", { params }),
    getByClient: (id, params) =>
      axios.get(`itemusages/client/${id}`, { params }),
    getByPatient: (id, params) =>
      axios.get(`itemusages/patient/${id}`, { params }),
    post: model => axios.post("itemusages", model)
  },
  deposits: {
    get: params => axios.get("/depositTransactions", { params }),
    getOne: id => axios.get("/depositTransactions/" + id),
    getToday: () => {
      let res = axios.get("/depositTransactions/today");
      return res;
    },
    getTotalByClient: clientId => {
      let res = axios.get("/depositTransactions/byClient", {
        params: { clientId }
      });
      return res;
    },
    getTotal: () => {
      let res = axios.get("/depositTransactions/TotalDeposit");
      return res;
    },
    post: params => axios.post("/depositTransactions", { ...params }),
    getAllClients() {
      return axios.get("/depositTransactions/balanceAllClients");
    }
  },
  cashInOuts: {
    get: params => axios.get("/cashInOuts", { params }),
    getToday: () => {
      let res = axios.get("/cashInOuts/today");
      return res;
    },
    post: model => axios.post("/cashInOuts", model)
  },
  suppliers: {
    get: async pager => {
      let res = await axios.get("/suppliers");
      return res;
    },
    getOne: id => axios.get(`/suppliers/${id}`),
    post: async params => {
      let res = await axios.post("/suppliers", params);
      return res;
    },
    put: async params => {
      let res = await axios.put(`/suppliers/`, params);
      return res;
    },
    delete: async id => {
      let res = await axios.delete(`/suppliers/${id}`);
      return res;
    }
  },
  commissionTypes: {
    getByUser: id => axios.get(`/commissiontypes/users/${id}`),
    post: model => axios.post("/commissiontypes", model),
    put: model => axios.put("/commissiontypes", model),
    delete: id => axios.delete(`/commissiontypes/${id}`)
  },
  commissions: {
    getMonthsByUser: id => axios.get(`/commissions/users/${id}/months`),
    getByUser: (id, yearmonth) =>
      axios.get(`/commissions/users/${id}/months/${yearmonth}`),
    post: model => axios.post("/commissions", model),
    postInPatient: ({ date, userId }) =>
      axios.post(`/commissions/inpatient/${userId}`, `"${date}"`)
  },
  formPasien: {
    get: params => axios.get(`FormPatient/`, { params }),
    getOne: id => axios.get(`FormPatient/${id}`),
    putBerhentiRawatInap: model =>
      axios.put("FormPatient/BerhentiRawatInap", model),
    putRawatInap: model => axios.put("FormPatient/RawatInap", model),
    putRawatJalan: model => axios.put("FormPatient/RawatJalan", model),
    putOperasi: model => axios.put("FormPatient/Operasi", model),
    putOperasiKhusus: model => axios.put("FormPatient/OperasiKhusus", model),
    putEuthanasia: model => axios.put("FormPatient/Euthanasia", model),
    putRujukan: model => axios.put("FormPatient/Rujukan", model)
  },
  formCuti: {
    get: params => {
      return axios.get("FormCutiStaffs", { params });
    },
    getOne: id => {
      return axios.get(`FormCutiStaffs/${id}`);
    },
    put: model => {
      return axios.put("FormCutiStaffs", model);
    },
    post: model => {
      return axios.post("FormCutiStaffs", model);
    },
    delete: id => {
      return axios.delete(`FormCutiStaffs/${id}`, {
        params: {}
      });
    },
    postForward: code => axios.post(`/FormCutiStaffs/forward/${code}`),
    postAccept: code => axios.post(`/FormCutiStaffs/accept/${code}`),
    postReject: code => axios.post(`/FormCutiStaffs/reject/${code}`)
  },
  inPatientTreatmentPlans: {
    get: id => {
      return axios.get(`inPatientTreatmentPlans/signalement/${id}`);
    },
    post: model => {
      return axios.post("inPatientTreatmentPlans", model);
    },
    postBulk: model => {
      return axios.post("inPatientTreatmentPlans/bulk", model); // model === SignalementModel
    }
  },
  inPatientTreatmentBoards: {
    get: params => {
      return axios.get(`inPatientTreatmentBoards`, { params });
    },
    getOne: id => {
      return axios.get(`inPatientTreatmentBoards/${id}`);
    },
    post: model => {
      return axios.post("inPatientTreatmentBoards", model);
    },
    put: model => {
      return axios.put(`inPatientTreatmentBoards`, model);
    }
    // putasd: (id, data) => {
    //   return axios.put(`inPatientTreatmentBoards/${id}`, { data });
    // }
  },
  salaries: {
    get: params => {
      return axios.get(`salaries`, { params });
    },
    getOne: id => {
      return axios.get(`salaries/${id}`);
    },
    post: model => {
      return axios.post("salaries", model);
    },
    put: model => {
      return axios.put(`inPatientTreatmentBoards`, model);
    },

    getPreSalaryLines: uid => {
      return axios.get(`salaries/users/${uid}/presalarylines`);
    },
    getDefaultLines: uid => {
      return axios.get(`salaries/users/${uid}/DefaultLines`);
    },
    postDefaultLine: (uid, model) => {
      return axios.post(`salaries/users/${uid}/DefaultLine`, model);
    },
    deleteDefaultLine: (uid, id) => {
      return axios.delete(`salaries/users/${uid}/DefaultLine/${id}`);
    }
  },
  finance: {
    lockMonthlyCommissions(date) {
      return axios.post("finances/LockMonthlyCommissions", date);
    },
    getLocks() {
      return axios.get("finances/Locks");
    },
    deleteLock(id) {
      return axios.delete(`finances/Locks/${id}`);
    }
  },
  dashboard: {
    getSalesData: year =>
      axios.get("dashboard/SalesData", { params: { year } }),
    getVisitData: year =>
      axios.get("dashboard/ClientVisits", { params: { year } }),
    getInsightData: date =>
      axios.get("dashboard/Insight", { params: { date } }),
    getTopCategoriesData: date =>
      axios.get("dashboard/TopCategories", { params: { date } })
  },
  database: {
    importClients: (fd, config) => axios.post("imports/clients", fd, config),
    importProducts: (fd, config) => axios.post("imports/products", fd, config)
  },
  server: {
    backupDb: async () => {
      let res = await axios.get("/server/backupDatabase", {
        responseType: "blob"
      });
      // let url = URL.createObjectURL(new Blob([res.data]))
      let url = URL.createObjectURL(res.data);
      let a = document.createElement("a");
      a.target = "_blank";
      a.setAttribute(
        "download",
        `${new Date().toJSON().split("T")[0]}_XINGAPP_DB_BACKUP.sql`
      );
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return response();
    },
    restoreDb: fd => axios.post("/server/RestoreDatabase", fd),
    truncateDb: () => axios.delete("/server/TruncateDb")
  }
};
