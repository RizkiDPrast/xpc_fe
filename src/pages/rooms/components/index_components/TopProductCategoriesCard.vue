<template>
  <div>
    <q-card style="height:430px">
      <q-toolbar>
        <q-toolbar-title> </q-toolbar-title>
        <q-btn
          flat
          round
          size="sm"
          icon="las la-sync"
          @click="fetch"
          :disable="loading"
        />
        <date-prev-next type="month" v-model="month" />
      </q-toolbar>
      <q-card-section>
        <q-linear-progress v-if="loading" />
       <apexchart v-else :options="options" :series="options.series" />
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import DatePrevNext from "src/components/DatePrevNext.vue";
export default {
  components: { DatePrevNext },
  name: "TopProductCategoriesCard",
  data() {
    return {
      loading: false,
      month: new Date(),
      options: {
        chart: {
          type: "pie",
          width: "100%",
          height: 400
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          pie: {
            customScale: 0.8,
            donut: {
              size: "75%"
            },
            offsetY: 20
          },
          stroke: {
            colors: undefined
          }
        },
        // colors: colorPalette,
        title: {
          text: "Sales by Categories",
          style: {
            fontSize: "12px"
          }
        },
        series: [],
        labels: [
          
        ],
        legend: {
          position: "left",
          offsetY: 20
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function(y) {
              if (typeof y !== "undefined") {
                return y.toLocaleString('id-ID');
              }
              return y;
            }
          }
        }
      }
    };
  },
  watch:{
    month(val){
      this.fetch()
    }
  },
  mounted(){
    this.fetch();
  },
  methods: {
    async fetch() {
      if(!this.month) return;
      if (this.loading) return;
      this.loading = true
      try {
        let res = await this.$api.dashboard.getTopCategoriesData(this.month)
        this.options.labels = res.data.map(x => x.category == null ? 'Other' : x.category)
        this.options.series = res.data.map(x => x.total)
        console.log(this.options.labels)
        console.log(this.options.series)
        
      } catch (error) {
        this.$toastr.error(error)
      }
      this.loading = false
    }
  }
};
</script>
