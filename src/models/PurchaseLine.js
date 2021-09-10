import UserTracker from "./UserTracker";
import Product from "./Product";
export default class PurchaseLine extends UserTracker {
  constructor({
    id = 0,
    purchaseId = 0,
    productId,
    itemName,
    unitId = 1,
    qty = 1,
    lineCost = 0,

    // calculated
    // unitCost,
    expDate,

    product = new Product(),

    ...params
  } = {}) {
    super(params);
    this.id = id;
    this.purchaseId = purchaseId;
    this.productId = productId;
    this.itemName = itemName;
    this.unitId = unitId;
    this.qty = qty;
    this.lineCost = lineCost;

    this.expDate = expDate;
    this.product = product;

    this.forDeletion = false;
  }

  get unitCost() {
    return this.qty > 0 ? this.lineCost / this.qty : 0;
  }
}
