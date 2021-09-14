<template>
  <div>
    <page-header>
      <template #actions>
        <animal-types-btn flat round />
      </template>
    </page-header>
    <my-table
      title="Patient list"
      :loading="loading"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pager"
      :filter="filter"
      @request="fetch"
      search-only
    >
      <template #actions>
        <q-toolbar>
          <q-toolbar-title>
            Filter:
          </q-toolbar-title>

          <animal-type-select
            label="Type"
            v-model="animalTypeId"
            :disable="loading"
            dense
            outlined
          />
          <sex-select
            style="min-width:100px;"
            label="Sex"
            v-model="sex"
            :disable="loading"
            dense
            outlined
            class="q-mx-sm"
          />
        </q-toolbar>
      </template>
      
      <template #body-cell-action="props">
        <q-td>
          <patient-to-boarding-btn :patientId="props.row.id" size="sm" round color="accent" flat />  
        </q-td>
      </template>

      <template #body-cell-clientid="props">
        <q-td>
          <q-btn
            dense
            flat
            no-caps
            color="primary"
            icon="las la-user-tie"
            :label="`${props.row.client.code} ${props.row.client.name}`"
            :to="
              `/app/rooms/vet/signalements/${props.row.client.id}/${props.row.id}`
            "
          />
        </q-td>
      </template>
    </my-table>
  </div>
</template>

<script>
import Patient from "src/models/Patient";
export default {
  data() {
    return {
      loading: false,
      data: [],
      columns: [
        {
          name: "clientid",
          label: "Client",
          field: "client.id",
          align: "left"
        },
          {
          name: "action",
          label: "action",
          field: "action",
          align: "left"
        },
        {
          name: "animaltypeid",
          label: "Type",
          field: "animalTypeId",
          align: "left",
          format: val => this.getAnimalTypeName(val)
        },
        {
          name: "name",
          label: "Name",
          field: "name",
          align: "left"
        },
        {
          name: "sex",
          label: "Sex",
          field: "sex",
          align: "left",
          format: val => this.getSexType(val)
        },
        {
          name: "dob",
          field: "doB",
          label: "Age",
          format: (val, row) => row.age
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
        rowsPerPage: 25,
        rowsNumber: 0
      },
      filter: undefined,
      animalTypeId: null,
      sex: null
    };
  },
  mounted() {
    this.fetch();
  },
  watch: {
    animalTypeId() {
      this.fetch();
    },
    sex() {
      this.fetch();
    }
  },
  methods: {
    async fetch(pager) {
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      pager.animalTypeId = this.animalTypeId;
      pager.sex = this.sex;

      try {
        var res = await this.$api.patients.get(pager);
        var dt = res.data;
        this.data = dt.rows.map(x => new Patient(x));

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
    }
    // add() {
    //   //console.log("add");
    //   this.$router.push({ path: `/app/rooms/client-pets` });
    // },
    // edit(id) {
    //   this.$router.push({ path: `/app/rooms/client-pets/${id}` });
    // },
    // async del(id) {
    //   console.log("delete", id);
    //   if (this.loading) return;
    //   this.loading = true;

    //   try {
    //     var res = await this.clients.delete(id);
    //     if (res.status < 300) {
    //       this.data = this.data.filter(val => val.id !== id);
    //       this.$toastr.success("Record was deleted");
    //     }
    //   } catch (e) {
    //     this.$toastr.error(e);
    //   }

    //   this.loading = false;
    // }
  }
};
</script>
