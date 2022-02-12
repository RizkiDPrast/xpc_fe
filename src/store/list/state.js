// import { UserType } from 'src/models'

export default {
  roles: [
    "Admin",
    "Finance",
    "Veterinarian",
    "FrontDesk",
    "Paramedic",
    "Groomer"
  ],
  animalTypes: [],
  appointmentTypes: [],
  units: [],
  categories: [],
  sexTypes: [
    { id: 1, name: "Male" },
    { id: 2, name: "Female" }
  ],
  signalementActions: [
    { value: 1, label: "RawatInap" },
    { value: 2, label: "RawatJalan" },
    { value: 3, label: "BerhentiRawatInap" },
    { value: 4, label: "Operasi" },
    { value: 5, label: "OperasiKhusus" },
    { value: 6, label: "Euthanasia" },
    { value: 7, label: "Rujukan" },
    { value: 0, label: "NA" }
  ],
  users: [],

  edcTypes: [
    // { value: 0, label: 'NA' },
    { value: "BCA", label: "BCA", id: 1 },
    { value: "MANDIRI", label: "MANDIRI", id: 2 },
    { value: "BNI", label: "BNI", id: 3 },
    { value: "BRI", label: "BRI", id: 4 },
    { value: "CIMB", label: "CIMB", id: 5 },
    { value: "PERMATA", label: "PERMATA", id: 6 }
  ],
  insentiveTypes: [
    { label: "PerQuantity", value: "PerQuantity", id: 1 },
    { label: "PerSales", value: "PerSales", id: 2 }
  ],
  insentiveModels: [],
  patientsByClient: {}
};
