import UserTracker from "./UserTracker";

export default class Appointment extends UserTracker {
  constructor(
    id,
    appointmentTypeId,
    clientId,
    name,
    waPhone,
    otherPhones,
    dueDate,
    note,
    confirmedByClient
  ) {
    super();
    this.id = id;
    this.appointmentTypeId = appointmentTypeId;
    this.clientId = clientId;
    this.name = name;
    this.waPhone = waPhone;
    this.otherPhones = otherPhones;
    this.dueDate = dueDate;
    this.note = note;
    this.confirmedByClient = confirmedByClient;
  }
}
