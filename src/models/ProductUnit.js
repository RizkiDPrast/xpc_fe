export default class ProductUnit {
  constructor({
    id = 0,
    productId,
    unitId,
    unitName,
    baseUnitId,
    toBaseMultiplier,
    unitPrice
  } = {}) {
    this.id = id;
    this.productId = productId;
    this.unitId = unitId;
    this.unitName = unitName;
    this.baseUnitId = baseUnitId;
    this.toBaseMultiplier = toBaseMultiplier;
    this.unitPrice = unitPrice;
  }
}
