<template>
  <div>
    <q-toolbar>
      <q-toolbar-title> </q-toolbar-title>
      <q-btn
        size="sm"
        title="Export as csv file"
        flat
        round
        icon="las la-file-excel"
        @click="exportCsv"
      />
    </q-toolbar>
    <q-markup-table bordered separator="cell" dense>
      <thead>
        <tr>
          <th rowspan="2">TANGGAL</th>
          <th rowspan="2">DRH YANG BERTUGAS</th>
          <th colspan="5">POLI KLINIK DAN ADM</th>
          <th colspan="5">OPERASI</th>
          <th colspan="5">LABORATORIUM</th>
          <th colspan="5">APOTIK</th>
          <th colspan="5">PETSHOP</th>
          <th colspan="5">GROOMING</th>
          <th colspan="4">DP RAWAT INAP (IN / OUT)</th>
          <th colspan="4">PELUNASAN RAWAT INAP</th>
          <th colspan="4">LAIN-LAIN</th>
          <th colspan="4">Total</th>
          <th rowspan="2" class="f">KETERANGAN</th>
        </tr>
        <tr>
          <th v-for="(i, x) in thSubs" :key="`t1-${x}`">{{ i }}</th>
          <th v-for="(i, x) in thSubs2" :key="`t2-${x}`">{{ i }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.date">
          <td>
            {{ row.date }}
          </td>
          <td>
            {{ row.vets }}
          </td>

          <td>
            {{ row.clinicPatientCount }}
          </td>
          <td>
            {{ row.clinicCash | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.clinicDebit | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.clinicTransfer | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.clinicCredit | money({ prefix: "" }) }}
          </td>

          <td>
            {{ row.surgeryPatientCount }}
          </td>
          <td>
            {{ row.surgeryCash | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.surgeryDebit | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.surgeryTransfer | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.surgeryCredit | money({ prefix: "" }) }}
          </td>

          <td>
            {{ row.laboratoryPatientCount }}
          </td>
          <td>
            {{ row.laboratoryCash | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.laboratoryDebit | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.laboratoryTransfer | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.laboratoryCredit | money({ prefix: "" }) }}
          </td>

          <td>
            {{ row.pharmacyPatientCount }}
          </td>
          <td>
            {{ row.pharmacyCash | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.pharmacyDebit | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.pharmacyTransfer | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.pharmacyCredit | money({ prefix: "" }) }}
          </td>

          <td>
            {{ row.petshopPatientCount }}
          </td>
          <td>
            {{ row.petshopCash | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.petshopDebit | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.petshopTransfer | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.petshopCredit | money({ prefix: "" }) }}
          </td>

          <td>
            {{ row.groomingPatientCount }}
          </td>
          <td>
            {{ row.groomingCash | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.groomingDebit | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.groomingTransfer | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.groomingCredit | money({ prefix: "" }) }}
          </td>

          <td>
            {{ row.inpatientDpCash | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.inpatientDpDebit | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.inpatientDpTransfer | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.inpatientDpCredit | money({ prefix: "" }) }}
          </td>

          <td>
            {{ row.inpatientRepaymentCash | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.inpatientRepaymentDebit | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.inpatientRepaymentTransfer | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.inpatientRepaymentCredit | money({ prefix: "" }) }}
          </td>

          <td>
            {{ row.otherCash | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.otherDebit | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.otherTransfer | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.otherCredit | money({ prefix: "" }) }}
          </td>

          <td>
            {{ row.totalCash | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.totalDebit | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.totalTranfer | money({ prefix: "" }) }}
          </td>
          <td>
            {{ row.totalCredit | money({ prefix: "" }) }}
          </td>
          <td class="f"></td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script>
import SalesReport from "src/models/SalesReport";

export default {
  name: "DailyReport",
  props: {
    group: {
      type: String,
      default: () => "daily" // daily | monthly
    },
    date: {
      type: Date,
      default: () => null
    }
  },
  data() {
    return {
      loading: false,
      data: []
    };
  },
  computed: {
    thSubs() {
      let types = "JUMLAH,TUNAI,DEBIT,TRANSFER,CREDIT,";
      var subs = types.repeat(6);
      subs = subs.substring(0, subs.length - 1);
      return subs.split(",");
    },
    thSubs2() {
      let types = "TUNAI,DEBIT,TRANSFER,CREDIT,";
      var subs = types.repeat(4);
      subs = subs.substring(0, subs.length - 1);
      return subs.split(",");
    }
  },
  watch: {
    loading(newVal) {
      this.$emit("loading", newVal);
    },
    date() {
      this.fetch();
    }
  },
  methods: {
    async fetch() {
      if (!this.date) {
        this.data = [];
        return;
      }

      if (this.loading) return;
      this.loading = true;

      try {
        var res = await this.$api.reports.getRevenue(
          // new Date("2021-10-14"),
          this.date,
          this.group
        );
        var values = Object.values(res.data).map(x => new SalesReport(x));

        if (!values.length) {
          this.$toastr.warning("There is no record");
          this.loading = false;
          return;
        }
        values.sort((a, b) => (a.date > b.date ? 1 : -1));

        this.data = values;
        console.log("this.data", this.data);
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    },
    exportCsv() {
      if (!this.data || !this.data.length) {
        this.$toastr.warning("No data to export");
        return;
      }

      let csvArr = [];
      let headers = Object.getOwnPropertyNames(new SalesReport());
      csvArr.push(headers.map(x => SalesReport.getKnownLabel(x)).join(","));
      this.data.forEach(dt => {
        var r = [];
        headers.forEach(propName => {
          r.push(dt[propName]);
        });
        csvArr.push(r.join(","));
      });

      let csv = `data:text/csv;charset=utf-8,${csvArr.join("\n")}`;
      var uri = window.encodeURI(csv);
      var link = document.createElement("a");
      link.download = "revenue_report.csv";
      link.href = uri;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  mounted() {
    // this.fetch();
  }
};
</script>
