import UserTracker from "./UserTracker";

export default class DepositTransaction extends UserTracker {
  constructor({
    id = 0,
    salesManagerId,
    depositCode,
    clientId,
    debit = 0,
    credit = 0,
    note,
    saleId,

    clientName,
    salesManager,

    createdByName,
    createdAt,

    ...params
  } = {}) {
    super(params);
    this.id = id;
    this.salesManagerId = salesManagerId;
    this.depositCode = depositCode;
    this.clientId = clientId;
    this.debit = debit;
    this.credit = credit;

    this.note = note;
    this.saleId = saleId;
    this.clientName = clientName;
    this.salesManager = salesManager;

    this.createdByName = createdByName;
    this.createdAt = createdAt;
  }
}
