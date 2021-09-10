import UserTracker from "./UserTracker";

export default class StockJournal extends UserTracker {
  constructor({
    productId,
    unitId,
    productName,
    unitName,
    stockIn = 0,
    stockOut = 0,
    note,
    recordedAt,
    purchaseLineId,

    qty = 0,
    ...params
  } = {}) {
    super(params);
    this.productId = productId;
    this.unitId = unitId;
    this.productName = productName;
    this.unitName = unitName;
    this.stockIn = stockIn;
    this.stockOut = stockOut;
    this.note = note;
    this.recordedAt = recordedAt;
    this.purchaseLineId = purchaseLineId;

    this.qty = qty;
  }
}
