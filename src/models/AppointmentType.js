import UserTracker from "./UserTracker";
export default class AppointmentType extends UserTracker {
  constructor({ id, name, colorCode = "#2b1fd1" } = {}) {
    super();
    this.id = id;
    this.name = name;
    this.colorCode = colorCode;
  }
}
