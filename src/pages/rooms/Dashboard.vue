<template>
  <div class="q-pa-md">
    <page-header title="Dashboard" />
    <div class="row">
      <SalesChartCard class="col-12" style="height:400px;"/>
    </div>
    <div class="row q-mt-md q-col-gutter-sm">
      <div class="col-sm-12 col-md-4 q-col-gutter-sm">
        <OverviewCard class="col-12"/>      
        <TopProductCategoriesCard class="col-12"/>
      </div>
      <client-visit-card class="col-sm-12 col-md-8"/>

    </div>
  </div>
</template>

<script>
import SalesChartCard from './components/index_components/SalesChartCard.vue'
import OverviewCard from './components/index_components/OverviewCard.vue'
import ClientVisitCard from './components/index_components/ClientVisitCard.vue'
import TopProductCategoriesCard from './components/index_components/TopProductCategoriesCard.vue'

export default {
  components:{
    SalesChartCard,
    OverviewCard,
    ClientVisitCard,
    TopProductCategoriesCard
  }
}
</script>