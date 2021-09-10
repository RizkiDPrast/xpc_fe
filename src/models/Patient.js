import UserTracker from "./UserTracker";
import { utility } from "src/boot/utility";
import AnimalType from "./AnimalType";

export default class Patient extends UserTracker {
  constructor({
    id,
    name,
    sex,
    doB,
    animalTypeId,
    clientId,
    animalType,
    visitingToday,
    client,
    avatar,
    ...params
  } = {}) {
    super(params);
    this.id = id;
    this.name = name;
    this.sex = sex;
    this.doB = doB;
    this.animalTypeId = animalTypeId;
    this.animalType =
      animalType && animalType !== null
        ? new AnimalType(animalType)
        : undefined;
    this.clientId = clientId;
    this.visitingToday = visitingToday;
    this.client = client;
    this.avatar = avatar;
  }

  get doBString() {
    return this.doB !== undefined
      ? utility.formatDate(this.doB, "YYYY/MM/DD")
      : "";
  }
  set doBString(val) {
    this.doB = utility.extractDate(val, "YYYY/MM/DD");
  }

  get age() {
    if (!this.doB || this.doB === null) return "";
    return utility.age(this.doB) + " old";
  }
}
