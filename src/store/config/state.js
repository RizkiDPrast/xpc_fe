export default function() {
  return {
    // lib:money options
    decimalSeparator: ",",
    thousandsSeparator: ".",
    precision: 2,
    prefix: "Rp ",

    // toLocaleString options
    defaultCurrency: "IDR", // 'IDR' 'BND'
    defaultLocale: "id-ID", // 'id-ID' 'ms-BN',

    autoPrintDepositOnSave: true,
    autoPrintSalesOnSave: true,
    defaultPettyCash: 500000
  };
}
