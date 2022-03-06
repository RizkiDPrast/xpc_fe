import UserTracker from "./UserTracker";
import CashBookEntryLine from "./CashBookEntryLine";

export default class CashBookEntry extends UserTracker {
  constructor({
    id = 0,

    date = new Date(),

    code,
    description,
    value,
    attachmentCount,

    cashBookEntryLines = [],
    appFiles = [],

    ...params
  } = {}) {
    super(params);
    this.id = id;
    this.date = date;
    this.code = code;

    this.description = description;

    this.value = value;
    this.attachmentCount = attachmentCount;

    this.cashBookEntryLines = !cashBookEntryLines
      ? []
      : cashBookEntryLines.map(x => new CashBookEntryLine(x));

    this.appFiles = appFiles || [];
  }
}
