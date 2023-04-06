import UserTracker from "./UserTracker";
import PurchaseLine from "./PurchaseLine";
import { utility } from "src/boot/utility";

export default class Purchase extends UserTracker {
  constructor({
    id = 0,
    purchaseDate = utility.formatDate(new Date(), "YYYY-MM-DD"),
    invoiceNumber,
    supplierId,
    supplier,
    // totalQty = 0,
    // totalCost = 0,

    realCost,
    isPaid = false,
    paidAt,
    accountCode,
    purchaseLines = [],
    ...params
  } = {}) {
    super(params);
    this.id = id;
    this.purchaseDate = purchaseDate;
    this.invoiceNumber = invoiceNumber;
    this.supplierId = supplierId;
    this.supplier = supplier;

    this.isPaid = isPaid;
    this.paidAt = paidAt;
    this.accountCode = accountCode;
    this.realCost = realCost;
    this.purchaseLines = purchaseLines.map(x => new PurchaseLine(x));
  }

  get totalQty() {
    return this.purchaseLines
      .filter(x => !x.forDeletion)
      .reduce((a, b) => a + Number(b.qty), 0);
  }

  get totalCost() {
    return this.purchaseLines
      .filter(x => !x.forDeletion)
      .reduce((a, b) => a + Number(b.lineCost), 0);
  }
}
