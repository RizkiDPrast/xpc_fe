export default class SalesReport {
  constructor({
    tanggal,
    drhYangBertugas,

    poli_Pasien = 0,
    poli_Tunai = 0,
    poli_Debit = 0,
    poli_Transfer = 0,
    poli_Kredit = 0,
    operasi_Pasien = 0,
    operasi_Tunai = 0,
    operasi_Debit = 0,
    operasi_Transfer = 0,
    operasi_Kredit = 0,
    lab_Pasien = 0,
    lab_Tunai = 0,
    lab_Debit = 0,
    lab_Transfer = 0,
    lab_Kredit = 0,
    // apotik_Pasien = 0,
    apotik_Tunai = 0,
    apotik_Debit = 0,
    apotik_Transfer = 0,
    apotik_Kredit = 0,
    // petShop_Pasien = 0,
    petShop_Tunai = 0,
    petShop_Debit = 0,
    petShop_Transfer = 0,
    petShop_Kredit = 0,
    // grooming_Pasien = 0,
    grooming_Tunai = 0,
    grooming_Debit = 0,
    grooming_Transfer = 0,
    grooming_Kredit = 0,

    dpRawatInap_Tunai = 0,
    dpRawatInap_Debit = 0,
    dpRawatInap_Transfer = 0,
    dpRawatInap_Kredit = 0,

    PelunasanRawatInap_Tunai = 0,
    PelunasanRawatInap_Debit = 0,
    PelunasanRawatInap_Transfer = 0,
    PelunasanRawatInap_Kredit = 0,

    lainnya_Tunai = 0,
    lainnya_Debit = 0,
    lainnya_Transfer = 0,
    lainnya_Kredit = 0,

    total_Tunai = 0,
    total_Debit = 0,
    total_Transfer = 0,
    total_Kredit = 0,

    unpaid = 0,
    receiptCodes = [],

  } = {}) {
    this.date = tanggal;
    this.vets = drhYangBertugas;
    this.clinicPatientCount = poli_Pasien;
    this.clinicCash = poli_Tunai;
    this.clinicDebit = poli_Debit;
    this.clinicTransfer = poli_Transfer;
    this.clinicCredit = poli_Kredit;
    this.surgeryPatientCount = operasi_Pasien;
    this.surgeryCash = operasi_Tunai;
    this.surgeryDebit = operasi_Debit;
    this.surgeryTransfer = operasi_Transfer;
    this.surgeryCredit = operasi_Kredit;
    this.laboratoryPatientCount = lab_Pasien;
    this.laboratoryCash = lab_Tunai;
    this.laboratoryDebit = lab_Debit;
    this.laboratoryTransfer = lab_Transfer;
    this.laboratoryCredit = lab_Kredit;
    // this.pharmacyPatientCount = apotik_Pasien;
    this.pharmacyCash = apotik_Tunai;
    this.pharmacyDebit = apotik_Debit;
    this.pharmacyTransfer = apotik_Transfer;
    // this.pharmacyCredit = petShop_Pasien;
    this.petshopPatientCount = petShop_Tunai;
    this.petshopCash = petShop_Tunai;
    this.petshopDebit = petShop_Debit;
    this.petshopTransfer = petShop_Transfer;
    this.petshopCredit = petShop_Kredit;
    // this.groomingPatientCount = grooming_Pasien;
    this.groomingCash = grooming_Tunai;
    this.groomingDebit = grooming_Debit;
    this.groomingTransfer = grooming_Transfer;
    this.groomingCredit = grooming_Kredit;

    this.inpatientDpCash = dpRawatInap_Tunai;
    this.inpatientDpDebit = dpRawatInap_Debit;
    this.inpatientDpTransfer = dpRawatInap_Transfer;
    this.inpatientDpCredit = dpRawatInap_Kredit;

    this.inpatientRepaymentCash = PelunasanRawatInap_Tunai;
    this.inpatientRepaymentDebit = PelunasanRawatInap_Debit;
    this.inpatientRepaymentTransfer = PelunasanRawatInap_Transfer;
    this.inpatientRepaymentCredit = PelunasanRawatInap_Kredit;

    this.otherCash = lainnya_Tunai;
    this.otherDebit = lainnya_Debit;
    this.otherTransfer = lainnya_Transfer;
    this.otherCredit = lainnya_Kredit;

    this.totalCash = total_Tunai;
    this.totalDebit = total_Debit;
    this.totalTransfer = total_Transfer;
    this.totalCredit = total_Kredit;


    this.unpaid = unpaid;
    this.receiptCodes = receiptCodes;
  }

  // get totalCash() {
  //   return Number(this.clinicCash)
  //     + Number(this.surgeryCash)
  //     + Number(this.laboratoryCash)
  //     + Number(this.pharmacyCash)
  //     + Number(this.petshopCash)
  //     + Number(this.groomingCash)
  //     + Number(this.inpatientDpCash)
  //     + Number(this.inpatientRepaymentCash)
  //     + Number(this.otherCash)
  // }

  // get totalDebit() {
  //   return Number(this.clinicDebit)
  //     + Number(this.surgeryDebit)
  //     + Number(this.laboratoryDebit)
  //     + Number(this.pharmacyDebit)
  //     + Number(this.petshopDebit)
  //     + Number(this.groomingDebit)
  //     + Number(this.inpatientDpDebit)
  //     + Number(this.inpatientRepaymentDebit)
  //     + Number(this.otherDebit)
  // }

  // get totalTranfer() {
  //   return Number(this.clinicTransfer)
  //     + Number(this.surgeryTransfer)
  //     + Number(this.laboratoryTransfer)
  //     + Number(this.pharmacyTransfer)
  //     + Number(this.petshopTransfer)
  //     + Number(this.groomingTransfer)
  //     + Number(this.inpatientDpTransfer)
  //     + Number(this.inpatientRepaymentTransfer)
  //     + Number(this.otherTransfer)
  // }

  // get totalCredit() {
  //   return Number(this.clinicCredit)
  //     + Number(this.toastrsurgeryCredit)
  //     + Number(this.laboratoryCredit)
  //     + Number(this.pharmacyCredit)
  //     + Number(this.petshopCredit)
  //     + Number(this.groomingCredit)
  //     + Number(this.inpatientDpCredit)
  //     + Number(this.inpatientRepaymentCredit)
  //     + Number(this.otherCredit)
  // }

  static getKnownLabel(val) {
    const known = {
      date: 'tanggal',
      vets: 'drhYangBertugas',
      clinicPatientCount: 'poli_Pasien',
      clinicCash: 'poli_Tunai',
      clinicDebit: 'poli_Debit',
      clinicTransfer: 'poli_Transfer',
      clinicCredit: 'poli_Kredit',
      surgeryPatientCount: 'operasi_Pasien',
      surgeryCash: 'operasi_Tunai',
      surgeryDebit: 'operasi_Debit',
      surgeryTransfer: 'operasi_Transfer',
      surgeryCredit: 'operasi_Kredit',
      laboratoryPatientCount: 'lab_Pasien',
      laboratoryCash: 'lab_Tunai',
      laboratoryDebit: 'lab_Debit',
      laboratoryTransfer: 'lab_Transfer',
      laboratoryCredit: 'lab_Kredit',
      // pharmacyPatientCount : 'apotik_Pasien',
      pharmacyCash: 'apotik_Tunai',
      pharmacyDebit: 'apotik_Debit',
      pharmacyTransfer: 'apotik_Transfer',
      // pharmacyCredit : 'petShop_Pasien',
      petshopPatientCount: 'petShop_Tunai',
      petshopCash: 'petShop_Tunai',
      petshopDebit: 'petShop_Debit',
      petshopTransfer: 'petShop_Transfer',
      petshopCredit: 'petShop_Kredit',
      // groomingPatientCount : 'grooming_Pasien',
      groomingCash: 'grooming_Tunai',
      groomingDebit: 'grooming_Debit',
      groomingTransfer: 'grooming_Transfer',
      groomingCredit: 'grooming_Kredit',

      inpatientDpCash: 'dpRawatInap_Tunai',
      inpatientDpDebit: 'dpRawatInap_Debit',
      inpatientDpTransfer: 'dpRawatInap_Transfer',
      inpatientDpCredit: 'dpRawatInap_Kredit',

      inpatientRepaymentCash: 'PelunasanRawatInap_Tunai',
      inpatientRepaymentDebit: 'PelunasanRawatInap_Debit',
      inpatientRepaymentTransfer: 'PelunasanRawatInap_Transfer',
      inpatientRepaymentCredit: 'PelunasanRawatInap_Kredit',

      otherCash: 'lainnya_Tunai',
      otherDebit: 'lainnya_Debit',
      otherTransfer: 'lainnya_Transfer',
      otherCredit: 'lainnya_Kredit',

      totalCash: 'total_Tunai',
      totalDebit: 'total_Debit',
      totalTransfer: 'total_Transfer',
      totalCredit: 'total_Kredit',
    }


    return known[val] || val
  }

}
