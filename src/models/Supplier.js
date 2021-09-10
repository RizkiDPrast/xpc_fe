import UserTracker from "./UserTracker";

export default class Supplier extends UserTracker {
  constructor({ id, name, phones, email, address, notes, ...params } = {}) {
    super(params);
    this.id = id;
    this.name = name;
    this.phones = phones;
    this.email = email;
    this.notes = notes;
  }
}
