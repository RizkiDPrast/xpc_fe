<template>
  <q-page>
    <page-header />
    <q-card-section class="row">
      <div class="col-7 q-pa-sm">
        <my-table
          title="Leave applications"
          :loading="loading"
          :data="data"
          :columns="columns"
          row-key="id"
          :pagination.sync="pager"
          :filter="filter"
          @request="fetch"
          @add="add"
          @delete="del"
          @edit="edit"
          :deleteBtnClass="isAdmin ? '' : 'disabled'"
        >
          <template #actions>
            <q-select
              style="min-width:100px;"
              v-model="approved"
              input-debounce="500"
              clearable
              :options="[
                { label: 'Disetujui saja', value: true },
                { label: 'Ditolak saja', value: false }
              ]"
              label="Filter status"
              dense
              borderless
            />
          </template>
          <template #body-cell-status="props">
            <q-td>
              <span
                v-if="
                  props.row.approvedByParty2At !== null ||
                    props.row.rejectedByParty2At !== null
                "
              >
                <q-badge
                  :color="
                    props.row.approvedByParty2At !== null
                      ? 'positive'
                      : 'negative'
                  "
                >
                  {{ props.row.party2Status }}
                  <q-tooltip>by {{ props.row.party2Name }}</q-tooltip>
                </q-badge>
              </span>
              <span v-else-if="props.row.deliveredToParty2At !== null">
                <q-badge color="warning">
                  @ {{ props.row.party2Name }}
                  <q-tooltip>{{ props.row.party2Status }}</q-tooltip>
                </q-badge>
              </span>
              <span v-else>
                <q-badge color="secondary">
                  @ {{ props.row.party1Name }}
                  <q-tooltip>
                    {{ props.row.party1Status }}
                  </q-tooltip>
                </q-badge>
              </span>
            </q-td>
          </template>
        </my-table>
      </div>
      <div class="col-5 q-pa-sm">
        <q-card class="my-card">
          <q-toolbar>
            <q-toolbar-title>
              Tambah / Edit Form Cuti
            </q-toolbar-title>
          </q-toolbar>
          <q-card-section>
            <q-form @submit="save" class="q-col-gutter-md full-width">
              <date-input
                name="tanggalPengajuan"
                v-validate="'required'"
                :error="errors.has('tanggalPengajuan')"
                :error-message="errors.first('tanggalPengajuan')"
                v-model="modelInput.tanggalPengajuan"
                label="Tanggal pengajuan *"
                :readonly="!canEdit(modelInput)"
                :hint="
                  modelInput.tanggalPengajuan
                    ? $util.toDateString(modelInput.tanggalPengajuan)
                    : ''
                "
              />
              <q-input
                ref="keterangan"
                v-model="modelInput.keterangan"
                name="keterangan"
                class=""
                v-validate="'required|max:255'"
                :error="errors.has('keterangan')"
                :error-message="errors.first('keterangan')"
                outlined
                label="Keterangan"
                autocomplete="off"
                dense
                hint="*isi bila digabung dengan off mingguan atau tabungan"
                type="textarea"
                rows="3"
                :readonly="!canEdit(modelInput)"
              />

              <q-input
                v-model="modelInput.jmlHari"
                name="jmlHari"
                class=""
                type="number"
                v-validate="'required|numeric|between:0,30'"
                :error="errors.has('jmlHari')"
                :error-message="errors.first('jmlHari')"
                outlined
                label="Jumlah hari *"
                autocomplete="off"
                dense
                min="0"
                step="1"
                :readonly="!canEdit(modelInput)"
              />

              <q-input
                v-model="modelInput.alasan"
                name="alasan"
                class=""
                v-validate="'required|max:255'"
                :error="errors.has('alasan')"
                :error-message="errors.first('alasan')"
                outlined
                label="Alasan *"
                autocomplete="off"
                dense
                type="textarea"
                rows="3"
                :readonly="!canEdit(modelInput)"
              />

              <q-btn
                :loading="loading"
                icon="las la-save"
                label="Save"
                title="Save"
                text-color="white"
                class="full-width q-mt-md"
                color="secondary"
                :disable="loading"
                @click.stop="save"
                :disabled="!canEdit(modelInput)"
              />
            </q-form>
          </q-card-section>
          <q-card-section v-if="modelInput.id">
            <q-markup-table flat :bordered="false">
              <tr>
                <td style="width:33.3%"></td>
                <td style="width:33.3%"></td>
                <td style="width:33.3%">
                  Depok,
                  {{ this.$util.toDateString(modelInput.createdAt, false) }}
                </td>
              </tr>
              <tr>
                <td style="width:33.3%;text-align:center">Diajukan oleh,</td>
                <td style="width:33.3%;text-align:center">Diketahui oleh,</td>
                <td style="width:33.3%;text-align:center">Disetujui oleh,</td>
              </tr>
              <tr>
                <td style="width:33.3%"></td>
                <td style="width:33.3%"></td>
                <td style="width:33.3%">
                  <div
                    style="height:50px;width:100%;
                        display:flex;
                        justify-content: center;
                        align-items: center;
                        text-align:center;
                        vertical-align:middle;
                        justify-content: center;
                        "
                  >
                    <q-badge
                      :color="
                        modelInput.approvedByParty2At !== null
                          ? 'positive'
                          : 'negative'
                      "
                    >
                      {{ modelInput.party2Status }}
                    </q-badge>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="width:33.3%;text-align:center">
                  {{ modelInput.createdByName }}
                </td>
                <td style="width:33.3%;text-align:center">
                  <u>{{ modelInput.party1Name }}</u
                  ><br />
                  <small>{{ modelInput.party1Status }}</small>
                </td>
                <td style="width:33.3%;text-align:center">
                  <u>{{ modelInput.party2Name }}</u
                  ><br />
                </td>
              </tr>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>
  </q-page>
</template>

<script>
export default {
  props: {
    id: {
      type: [Number, String],
      default: () => undefined
    }
  },
  data() {
    return {
      modelInput: {},
      loading: false,
      data: [],
      columns: [
        {
          name: "action",
          label: "action",
          field: "action",
          width: "25px",
          align: "center"
        },
        {
          name: "createdByName",
          label: "Dibuat oleh",
          field: "createdByName",
          align: "left"
        },
        {
          name: "tanggalPengajuan",
          label: "Tanggal Pengajuan",
          field: "tanggalPengajuan",
          align: "left",
          format: val => this.$util.formatDate(val, "dddd, DD MMMM YYYY")
        },
        {
          name: "keterangan",
          label: "Keterangan",
          field: "keterangan",
          align: "left"
        },
        {
          name: "jmlHari",
          label: "Jml hari",
          field: "jmlHari",
          align: "left"
        },
        {
          name: "alasan",
          label: "Alasan",
          field: "alasan",
          align: "left"
        },
        {
          name: "status",
          label: "Status",
          align: "left"
        },
        {
          name: "modifiedat",
          label: "Last Modified At",
          field: "modifiedAt",
          align: "left",
          format: val => this.$util.toDateString(val)
        }
      ],
      pager: {
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0
      },
      filter: undefined,
      approved: undefined
    };
  },
  mounted() {
    this.fetch();
  },
  watch: {
    approved() {
      this.fetch();
    }
  },
  methods: {
    canEdit(model) {
      if (!model.id) return true;
      if (
        this.isAdmin ||
        (this.auth.id === model.party1Id && model.approvedByParty1At === null)
      ) {
        return true;
      }
      return false;
    },
    async save() {
      if (!(await this.$validator.validate())) {
        console.log(this.errors);
        this.$toastr.error("Please fix all error(s)");
        return;
      }

      if (this.loading) return;
      this.loading = true;

      var m = this.modelInput;
      m.email = m.email || "-";
      m.party1Id = m.party1Id || "-";
      m.party1Name = m.party1Name || "-";
      m.party1Email = m.party1Email || "-";
      m.party2Id = m.party2Id || "-";
      m.party2Name = m.party2Name || "-";
      m.party2Email = m.party2Email || "-";

      m.jmlHari = Number(m.jmlHari);

      let res;
      try {
        if (this.modelInput.id) {
          res = await this.$api.formCuti.put(this.modelInput);
        } else {
          res = await this.$api.formCuti.post(this.modelInput);
        }
        this.$toastr.success("Record was updated");
        this.modelInput = {};
        this.loading = false;
        this.fetch();
      } catch (error) {
        this.loading = false;
        this.$toastr.error(error);
        throw error;
      }
    },
    async fetch(pager) {
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      if (this.approved != null && this.approved) {
        pager.approved = this.approved.value;
      } else {
        pager.approved = null;
      }

      try {
        var res = await this.$api.formCuti.get(pager);
        var dt = res.data;
        this.data = dt.rows.map(x => x);

        this.columns = this.columns.map(x => {
          return Object.assign({}, x, {
            sortable: dt.sortColumns.indexOf(x.name.toLowerCase()) > -1
          });
        });

        this.pager.rowsNumber = dt.rowsNumber;
        this.pager.page = dt.page;
        this.pager.sortBy = dt.sortBy;
        this.pager.descending = dt.descending;
        this.pager.rowsPerPage = dt.rowsPerPage;

        let id = Number(this.id);
        if (this.data.length && !isNaN(id)) {
          this.edit(id);
        }
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    },
    focus() {
      this.$refs.keterangan.focus();
    },
    add() {
      this.modelInput = {};
      this.focus();
    },
    edit(id) {
      let t = this.data.find(x => x.id === id);
      if (!t) {
        throw "Could not find details record. Please refresh table";
      }
      this.modelInput = Object.assign({}, t);
      this.focus();
    },
    async del(id) {
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.formCuti.delete(id);
        if (res.status < 300) {
          this.loading = false;
          this.fetch();
          this.$toastr.success("Record was deleted");
        }
      } catch (e) {
        this.$toastr.error(e);
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.q-col-gutter-x-md > *,
.q-col-gutter-md > * {
  padding-left: unset;
}
</style>
