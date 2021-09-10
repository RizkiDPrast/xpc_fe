import UserTracker from "./UserTracker";
export default class AnimalType extends UserTracker {
  constructor({ id = 0, name, ...params } = {}) {
    super(params);
    this.id = id;
    this.name = name;
  }
}
