import UserTracker from "./UserTracker";

export default class CashBookEntryLine extends UserTracker {
  constructor({
    id = 0,

    cashBookEntryId,
    accountCode,
    accountDescription,
    description,

    debit = 0,
    credit = 0,

    contraAccountCode,
    ...params
  } = {}) {
    super(params);
    this.id = id;
    this.cashBookEntryId = cashBookEntryId;
    this.accountCode = accountCode;
    this.accountDescription = accountDescription;
    this.description = description;

    this.debit = debit;
    this.credit = credit;

    this.contraAccountCode = contraAccountCode;
  }

  get lineTotal() {
    return Number(this.debit) - Number(this.credit);
  }
}
