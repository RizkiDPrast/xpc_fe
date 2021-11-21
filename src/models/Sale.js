import SaleLine from "./SaleLine";
import UserTracker from "./UserTracker";

export default class Sale extends UserTracker {
  constructor({
    id,
    salesManagerId,
    clientId,

    saleDate,
    receiptCode,
    percentDiscount = 0,
    moneyDiscount = 0,
    tax = 0,
    cardSurcharge = 0, // for credit card

    cash = 0,
    transfer = 0,
    debitCard = 0,
    creditCard = 0,
    ccEdcType,
    dcEdcType,
    deposit = 0,

    subTotal = 0,
    change = 0,

    isTracked = false,
    note,
    isPrinted,

    saleLines = [],
    client,
    salesManager,

    createdByName,
    unpaid = 0,
    saleLineId,
    saleRef,
    createdAt
  } = {}) {
    super();
    this.id = id;
    this.salesManagerId = salesManagerId;
    this.clientId = clientId;

    this.saleDate = saleDate;
    this.receiptCode = receiptCode;
    this.percentDiscount = percentDiscount;
    this.moneyDiscount = moneyDiscount;
    this.tax = tax;
    this.cardSurcharge = cardSurcharge;

    this.cash = cash;
    this.transfer = transfer;
    this.debitCard = debitCard;
    this.creditCard = creditCard;
    this.ccEdcType = ccEdcType;
    this.dcEdcType = dcEdcType;
    this.deposit = deposit;

    this.subTotal = subTotal;
    this.change = change;

    this.isTracked = isTracked;
    this.note = note;
    this.isPrinted = isPrinted;

    this.saleLines =
      saleLines && saleLines != null && saleLines.length
        ? saleLines.map(x => new SaleLine(x))
        : [];
    this.client = client;
    this.salesManager = salesManager;

    this.createdByName = createdByName;
    this.unpaid = unpaid;
    this.saleLineId = saleLineId;
    this.saleRef = saleRef;
    this.createdAt = createdAt;
  }

  get total() {
    return (
      this.subTotal -
      this.moneyDiscount -
      (this.subTotal * Number(this.percentDiscount)) / 100
    );
  }

  get grandTotal() {
    return (
      this.total +
      (this.total * Number(this.tax)) / 100 +
      Number(this.cardSurcharge)
    );
  }

  get realCash() {
    return Number(this.cash) + Number(this.deposit) - Number(this.change);
  }

  get card() {
    return Number(this.debitCard) + Number(this.creditCard);
  }

  get totalPayment() {
    const payment =
      Number(this.cash) +
      Number(this.transfer) +
      Number(this.card) +
      Number(this.deposit) -
      Number(this.change);
    return payment;
  }

  get totalUnpaid() {
    if (this.totalPayment < this.grandTotal) {
      return this.grandTotal - this.totalPayment;
    }
    return 0;
  }

  get revenue() {
    const unpaid = Number(this.change);
    return unpaid > 0 ? this.grandTotal - unpaid : this.totalPayment;
    // return this.totalPayment > this.grandTotal
    //   ? this.grandTotal - this.deposit
    //   : this.totalPayment - this.deposit;
  }

  get isClosed() {
    return this.salesManagerId && this.salesManagerId !== null;
  }

  get discountPercentMoneyValue() {
    return (this.subTotal * Number(this.percentDiscount)) / 100;
  }

  get taxMoneyValue() {
    return (Number(this.tax) * this.total) / 100;
  }
}
