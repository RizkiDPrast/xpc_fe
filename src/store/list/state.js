// import { UserType } from 'src/models'

export default {
  roles: ["Admin", "Finance", "Veterinarian", "Paramedic", "Groomer"],
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
    { value: "BNI", label: "BNI", id: 3 }
  ],
  insentiveTypes: [
    { label: "PerQuantity", value: "PerQuantity", id: 1 },
    { label: "PerSales", value: "PerSales", id: 2 }
  ],
  insentiveModels: [],
  patientsByClient: {}
};
