import VueApexCharts from 'vue-apexcharts'
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ( {Vue} ) => {
  Vue.use(VueApexCharts)
  Vue.component('apexchart', VueApexCharts)
}
