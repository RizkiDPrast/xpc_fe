import { utility } from "src/boot/utility.js";
import ProductUnit from "./ProductUnit.js";
import UserTracker from "./UserTracker.js";

export default class Product extends UserTracker {
  constructor({
    id = 0,
    name,
    sku,
    unitId,
    categoryId,
    purchasingPrice = 0,
    netPrice = 0,
    markup = 0,
    markupPercent = 0,
    discount = 0,
    discountPercent = 0,
    productionCost = 0,

    // sellingPrice = 0,

    trackInventory = false,
    minimumQty = 0,
    petShopProduct = false,
    discontinued = false,

    qty = 0,
    unitName,

    notes,
    productUnits = [],
    ...params
  } = {}) {
    super(params);
    this.id = id;
    this.name = name;
    this.sku = sku;
    this.unitId = unitId;
    this.categoryId = categoryId;
    this.purchasingPrice = purchasingPrice;
    this.netPrice = netPrice;
    this.markup = markup;
    this.markupPercent = markupPercent;
    this.discount = discount;
    this.petShopProduct = petShopProduct;
    this.discountPercent = discountPercent;
    this.productionCost = productionCost;

    // this.sellingPrice = sellingPrice// generated

    this.trackInventory = trackInventory;
    this.minimumQty = minimumQty;
    this.discontinued = discontinued;

    this.qty = Number(qty);
    this.unitName = unitName;
    this.notes = notes;

    this.productUnits =
      productUnits && productUnits.length
        ? productUnits.map(x => new ProductUnit(x))
        : [];
  }

  get hasDiscount() {
    return this.discount > 0 || this.discountPercent > 0;
  }

  get sellingPrice() {
    return (
      utility.toNumber(this.netPrice) +
      utility.toNumber(this.markup) +
      (utility.toNumber(this.markupPercent) * utility.toNumber(this.netPrice)) /
        100 +
      utility.toNumber(this.productionCost) -
      utility.toNumber(this.discount) -
      (utility.toNumber(this.discountPercent) *
        utility.toNumber(this.netPrice)) /
        100
    );
  }

  get sellingPriceWithoutDisc() {
    return (
      utility.toNumber(this.netPrice) +
      utility.toNumber(this.markup) +
      (utility.toNumber(this.markupPercent) * utility.toNumber(this.netPrice)) /
        100 +
      utility.toNumber(this.productionCost)
    );
  }
}
