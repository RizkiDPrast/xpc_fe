import UserTracker from "./UserTracker";

export default class ItemUsage extends UserTracker {
  constructor({
    id,
    clientId,
    patientId,
    productId,
    itemName,
    unitId,
    unitCost = 0,

    unitPrice = 0,
    qty = 1,
    prescribedAt = new Date(),
    productName,
    unitName,
    category,
    transferedToReceipt,

    itemUsageIds = [], // for saleLines
    trackInventory,
    ...params
  } = {}) {
    super(params);
    this.id = id;
    this.clientId = clientId;
    this.patientId = patientId;
    this.productId = productId;
    this.unitId = unitId;
    this.itemName = itemName;
    this.prescribedAt = prescribedAt;
    this.productName = productName;
    this.unitName = unitName;
    this.unitPrice = unitPrice;
    this.qty = qty;
    this.category = category;
    this.transferedToReceipt = transferedToReceipt;

    this.itemUsageIds = itemUsageIds;

    this.trackInventory = trackInventory;
  }

  get lineTotal() {
    return Number(this.unitPrice) * this.qty;
  }
}
