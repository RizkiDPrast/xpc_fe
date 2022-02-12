import Unit from "src/models/Unit";
import Category from "src/models/Category";
import AnimalType from "src/models/AnimalType";
import Patient from "src/models/Patient";
import AppointmentType from "src/models/AppointmentType";

export function setAnimalTypes(state, model) {
  if (model && Array.isArray(model)) {
    const t = model.map(x => new AnimalType(x));
    state.animalTypes = t;
  }
}

export function setAppointmentTypes(state, model) {
  if (Array.isArray(model)) {
    const t = model.map(x => new AppointmentType(x));
    state.appointmentTypes = t;
  }
}

export function setUnits(state, model) {
  if (Array.isArray(model)) {
    const t = model.map(x => new Unit(x));
    state.units = t;
  }
}

export function setCategories(state, model) {
  if (Array.isArray(model)) {
    const t = model.map(x => new Category(x));
    state.categories = t;
  }
}

export function setInsentiveModels(state, model) {
  if (Array.isArray(model)) {
    const t = model.map(x => new InsentiveModel(x));
    state.insentiveModels = t;
  }
}

export function setPatientsByClient(state, model) {
  if (Array.isArray(model)) {
    var obj = {};
    model.forEach((elm, i) => {
      if (!obj[elm.clientId]) {
        obj[elm.clientId] = [];
      }
      obj[elm.clientId].push(new Patient(elm));
    });

    var cState = JSON.parse(JSON.stringify(state.patientsByClient));
    for (var i in obj) {
      console.log(i);
      cState[i] = obj[i];
    }
    state.patientsByClient = cState;
  }
}

export function setUsers(state, model) {
  if (Array.isArray(model)) {
    const t = model.map(x => x);
    state.users = t;
  } else {
    state.users = [];
  }
}
