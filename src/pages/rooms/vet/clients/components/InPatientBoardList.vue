<template>
  <q-card class="my-card" v-if="patient && patient !== null && patient.id">
    <q-card-section>
      <q-item>
        <q-item-section avatar>
          <patient-avatar :value="patient" />
        </q-item-section>
        <q-item-section>
          <q-item-label title>
            {{ getAnimalTypeName(patient.animalTypeId) }} {{ patient.name }}
          </q-item-label>
          <q-item-label caption>
            {{ patient.age }} {{ getSexType(patient.sex) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-card-section>
      <my-table
        :loading="loading"
        :data="data"
        :columns="columns"
        row-key="id"
        :pagination.sync="pager"
        :filter="filter"
        @request="fetch"
        search-only
      >
        <template #title>
          <q-toolbar-title style="min-width:200px;">
            In Patient Board List
          </q-toolbar-title>
        </template>
        <template #body-cell-action="props">
          <q-td align="center">
            <q-btn
              round
              flat
              size="sm"
              icon="las la-pencil-alt"
              @click="onClick(props.row)"
            />
          </q-td>
        </template>
      </my-table>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  props: {
    patient: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      data: [],
      columns: [
        {
          name: "action",
          label: "Action",
          align: "center"
        },
        {
          name: "createdat",
          label: "Created At",
          field: "createdAt",
          align: "left",
          format: val => this.$util.formatDate(val, "dddd DD MMMM YYYY")
        },
        {
          name: "signalement.diagnose",
          label: "Diagnose",
          field: "signalement",
          align: "left",
          format: val => val.diagnose
        },
        {
          name: "signalement.notes",
          label: "Notes",
          field: "signalement",
          align: "left",
          format: val => val.notes
        },
        {
          name: "modifiedat",
          label: "Last Modified At",
          field: "modifiedAt",
          align: "left",
          format: val => this.$util.formatDate(val, "dddd DD MMMM YYYY")
        },
        {
          name: "modifiedbyname",
          label: "Last Modified by",
          field: "modifiedByName",
          align: "left"
        }
      ],
      pager: {
        page: 1,
        rowsPerPage: 25,
        rowsNumber: 0
      },
      filter: undefined
    };
  },
  watch: {
    "patient.id"() {
      this.fetch();
    }
  },
  methods: {
    async fetch(pager) {
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      pager.patientId = this.patient.id;
      try {
        var res = await this.$api.inPatientTreatmentBoards.get(pager);
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
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    },
    onClick(form) {
      this.$router.push(
        `/app/rooms/vet/in-patient-treatment-board/signalement/${form.id}`
      );
    }
  }
};
</script>
