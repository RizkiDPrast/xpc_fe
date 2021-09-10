export default class Unit {
  constructor({ id = 0, name, description } = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}
