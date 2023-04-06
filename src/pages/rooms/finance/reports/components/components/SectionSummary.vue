<template>
  <section
    class="row col-md-12 penerimaan q-col-gutter-md"
    style="margin:6px 0"
  >
    <q-toolbar>
      <q-toolbar-title>Ringkasan</q-toolbar-title>
    </q-toolbar>
    <div class="col-12 col-md-6" style="padding-top:0;padding-top:6px;">
      <q-card>
        <q-card-section>
          <table class="no-border full-width">
            <thead>
              <tr>
                <th colspan="2">Ringkasan Rugi Laba {{ label }}</th>
              </tr>
            </thead>
            <tbody :class="{ 'text-grey': loading }">
              <tr>
                <td colspan="3">
                  <q-linear-progress
                    indeterminate
                    v-if="loading"
                  ></q-linear-progress>
                </td>
              </tr>
              <tr>
                <td class="text-left">Penerimaan Usaha</td>
                <td class="text-right">{{ data.pendapatanOp | money }}</td>
              </tr>
              <tr>
                <td class="text-left">Penerimaan Lain</td>
                <td class="text-right">{{ data.pendapatanNonOp | money }}</td>
              </tr>
              <tr>
                <td class="text-left">Pengeluaran Usaha</td>
                <td class="text-right">{{ data.bebanOp | money }}</td>
              </tr>
              <tr>
                <td class="text-left">Pengeluaran Lain</td>
                <td class="text-right">{{ data.bebanNonOp | money }}</td>
              </tr>
              <tr>
                <td class="text-left">Biaya-biaya</td>
                <td class="text-right">{{ data.biaya | money }}</td>
              </tr>
              <tr>
                <td class="text-left">HPP</td>
                <td class="text-right">{{ data.hpp | money }}</td>
              </tr>

              <tr>
                <th>L/R</th>
                <td
                  class="text-right"
                  :class="{
                    'text-positive': data.pl > 0,
                    'text-negative': data.pl < 0
                  }"
                >
                  <b> {{ data.pl | money }}</b>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-12 col-md-6" style="padding-top:0;padding-top:6px;">
      <q-card>
        <q-card-section>
          <table class="no-border full-width">
            <thead>
              <tr>
                <th colspan="2">Ringkasan Saldo L/R</th>
              </tr>
            </thead>
            <tbody :class="{ 'text-grey': loading }">
              <tr>
                <td colspan="3">
                  <q-linear-progress
                    indeterminate
                    v-if="loading"
                  ></q-linear-progress>
                </td>
              </tr>
              <tr>
                <td class="text-left">L/R sebelumnya</td>
                <td class="text-right">{{ data.plSebelumnya | money }}</td>
              </tr>
              <tr>
                <td class="text-left">Total Penerimaan</td>
                <td class="text-right">{{ data.totalPendapatan | money }}</td>
              </tr>
              <tr>
                <td class="text-left">Total Pengeluaran</td>
                <td class="text-right">{{ data.totalPengeluaran | money }}</td>
              </tr>
              <tr>
                <td class="text-center text-bold">L/R akhir</td>
                <td
                  class="text-right"
                  :class="{
                    'text-positive': data.pl > 0,
                    'text-negative': data.pl < 0
                  }"
                >
                  <b>{{ (data.plSebelumnya + data.plSebelumnya) | money }}</b>
                </td>
              </tr>
              <tr>
                <td colspan="2"><q-separator></q-separator></td>
              </tr>
              <tr>
                <td class="text-left">Deposit sebelumnya</td>
                <td class="text-right">{{ data.depositSebelumnya | money }}</td>
              </tr>
              <tr>
                <td class="text-left">Deposit {{ label }}</td>
                <td class="text-right">{{ data.deposit | money }}</td>
              </tr>
              <tr>
                <td class="text-left">Deposit akhir</td>
                <td class="text-right">
                  <b>{{ (data.deposit + data.depositSebelumnya) | money }}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>
<script>
import SummaryReport from "src/models/SummaryReport";

export default {
  name: "SectionSummary",
  props: {
    startDate: {
      type: Date,
      default: () => null
    },
    endDate: {
      type: Date,
      default: () => null
    },
    label: {
      type: String || undefined,
      default: () => ""
    }
  },
  data() {
    return {
      loading: false,
      data: new SummaryReport(),
      data1: [
        {
          tanggal: "11 Januari 2023",
          keterangan: "Test item",
          jumlah: "200000"
        },
        {
          tanggal: "12 Januari 2023",
          keterangan: "Test item",
          jumlah: "500000"
        }
      ]
    };
  },
  watch: {
    startDate(nval, oval) {
      this.fetch();
    }
  },
  methods: {
    async fetch() {
      if (!this.startDate) {
        this.data = [];
        return;
      }

      if (this.loading) return;
      this.loading = true;

      try {
        var res = await this.$api.reports.getSummary(
          this.startDate,
          this.endDate
        );
        this.data = new SummaryReport(res.data);
        console.log("this.data", this.data);
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    }
  }
};
</script>
