import UserTracker from "./UserTracker";

export default class StockOpname extends UserTracker {
  constructor({
    productId,
    unitId,
    productName,
    unitName,
    qty,
    lastTransactionAt,
    lastNote,
    minimumQty,
    ...params
  } = {}) {
    super(params);
    this.productId = productId;
    this.unitId = unitId;
    this.productName = productName;
    this.unitName = unitName;
    this.qty = qty;
    this.lastTransactionAt = lastTransactionAt;
    this.lastNote = lastNote;
    this.minimumQty = minimumQty;
  }
}
