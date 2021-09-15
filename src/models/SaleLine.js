import UserTracker from "./UserTracker";

export default class SaleLine extends UserTracker {
  constructor({
    id,
    saleId,
    productId,
    unitId,

    itemName,
    unitCost,
    unitPrice,
    qty,
    percentDiscount = 0,
    moneyDiscount = 0,

    unitName,
    product,
    maxUnit = 0,

    itemUsageIds = [],

    debtSaleId,

    ...params
  } = {}) {
    super(params);
    this.id = id;
    this.saleId = saleId;
    this.productId = productId;
    this.unitId = unitId;

    this.itemName = itemName;
    this.unitCost = unitCost;
    this.unitPrice = unitPrice;
    this.qty = qty;
    this.percentDiscount = percentDiscount;
    this.moneyDiscount = moneyDiscount;

    this.unitName = unitName;
    this.product = product;
    this.maxUnit = maxUnit;

    this.itemUsageIds = itemUsageIds;

    this.debtSaleId= debtSaleId;
  }

  get rowTotal() {
    return (
      (this.unitPrice -
        this.moneyDiscount -
        (this.percentDiscount * this.unitPrice) / 100) *
      this.qty
    );
  }

  get hasDiscount() {
    return Number(this.percentDiscount) + Number(this.moneyDiscount);
  }
}
