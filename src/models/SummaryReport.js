export default class SummaryReport {
  constructor({
    bebanOp,
    bebanNonOp,
    biaya,
    pendapatanOp,
    pendapatanNonOp,
    hpp,
    deposit,

    bebanOpSebelumnya,
    bebanNonOpSebelumnya,
    biayaSebelumnya,
    pendapatanOpSebelumnya,
    pendapatanNonOpSebelumnya,
    hppSebelumnya,
    depositSebelumnya,

    totalPendapatan,
    totalPengeluaran,
    pl,

    totalPendapatanSebelumnya,
    totalPengeluaranSebelumnya,
    plSebelumnya,
  } = {}) {
    this.bebanOp = bebanOp;
    this.bebanNonOp = bebanNonOp;
    this.biaya = biaya;
    this.pendapatanOp = pendapatanOp;
    this.pendapatanNonOp = pendapatanNonOp;
    this.hpp = hpp;
    this.deposit = deposit;


    this.bebanOpSebelumnya = bebanOpSebelumnya;
    this.bebanNonOpSebelumnya = bebanNonOpSebelumnya;
    this.biayaSebelumnya = biayaSebelumnya;
    this.pendapatanOpSebelumnya = pendapatanOpSebelumnya;
    this.pendapatanNonOpSebelumnya = pendapatanNonOpSebelumnya;
    this.hppSebelumnya = hppSebelumnya;
    this.depositSebelumnya = depositSebelumnya;

    this.totalPendapatan = totalPendapatan
    this.totalPengeluaran = totalPengeluaran
    this.pl = pl

    this.totalPendapatanSebelumnya = totalPendapatanSebelumnya
    this.totalPengeluaranSebelumnya = totalPengeluaranSebelumnya
    this.plSebelumnya = plSebelumnya
  }


}
