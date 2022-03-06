export default class UserTracker {
  constructor({
    createdAt = new Date(),
    createdBy,
    modifiedAt = new Date(),
    modifiedBy,
    createdByName,
    modifiedByName
  } = {}) {
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.modifiedAt = modifiedAt;
    this.modifiedBy = modifiedBy;
    this.createdByName = createdByName;
    this.modifiedByName = modifiedByName;
  }
}
