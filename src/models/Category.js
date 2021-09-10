export default class Category {
  constructor({ id = 0, name, description } = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}
