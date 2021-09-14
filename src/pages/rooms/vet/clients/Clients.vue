<template>
  <div>
    <page-header>
      <template #actions>
        <animal-types-btn flat round />
      </template>
    </page-header>
    <my-table
      title="Client list"
      :loading="loading"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pager"
      :filter="filter"
      @request="fetch"
      @delete="del"
      @add="add"
      @edit="edit"
    >
      <template #actions>
        <q-input
          :disable="loading"
          v-model="code"
          label="Code (RM)"
          dense
          outlined
          clearable
          debounce="500"
        />
      </template>
      <template #body-cell-email="props">
        <q-td>
          <email-btn v-if="props.row.email" :value="props.row.email" />
          {{ props.row.email }}
        </q-td>
      </template>

      <template #body-cell-action="props">
        <td-action
          :id="props.row.id"
          :name="
            props.row.name ||
              props.row.code ||
              props.row.displayName ||
              props.row.userName
          "
          @edit="edit"
          @delete="del"
        >
         <q-btn round text-color="positive" size="sm" icon="las la-home" :to="`/app/rooms/client-pets/${props.row.id}`">
          <q-tooltip content-class="bg-secondary">
            Add to queue
          </q-tooltip>
        </q-btn>
        </td-action>
      </template>
      <template #body-cell-phone="props">
        <q-td>
          <template v-if="props.row.waPhone">
            <wa-btn :value="props.row.waPhone" />
            {{ props.row.waPhone }} <br />
          </template>
          <template v-if="props.row.otherPhones">
            Other phones: {{ props.row.otherPhones }}
          </template>
        </q-td>
      </template>
    </my-table>
  </div>
</template>

<script>
import Client from "src/models/Client";
export default {
  data() {
    return {
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
          name: "code",
          label: "Code",
          field: "code",
          align: "left"
        },
        {
          name: "name",
          label: "Name",
          field: "name",
          align: "left"
        },
        {
          name: "email",
          label: "Email",
          field: "email",
          align: "left"
        },
        {
          name: "phone",
          label: "Phone",
          field: "phone",
          align: "left"
        },
        {
          name: "Notes",
          label: "Notes",
          field: "notes",
          align: "left"
        },
        {
          name: "icnumber",
          label: "IC",
          field: "icNumber",
          align: "left"
        },
        {
          name: "address",
          label: "Address",
          field: "address",
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
        rowsPerPage: 25,
        rowsNumber: 0
      },
      filter: undefined,
      code: null
    };
  },
  mounted() {
    this.fetch();
  },
  watch: {
    code() {
      this.fetch();
    }
  },
  methods: {
    async fetch(pager) {
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      pager.code = this.code;
      try {
        var res = await this.$api.clients.get(pager);
        var dt = res.data;
        this.data = dt.rows.map(x => new Client(x));

        this.columns = this.columns.map(x => {
          return Object.assign({}, x, {
            sortable: dt.sortColumns.indexOf(x.field.toLowerCase()) > -1
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
    add() {
      //console.log("add");
      this.$router.push({ path: `/app/rooms/client-pets` });
    },
    edit(id) {
      this.$router.push({ path: `/app/rooms/vet/signalements/${id}` });
    },
    async del(id) {
      console.log("delete", id);
      if (this.loading) return;
      this.loading = true;

      try {
        var res = await this.clients.delete(id);
        if (res.status < 300) {
          this.data = this.data.filter(val => val.id !== id);
          this.$toastr.success("Record was deleted");
        }
      } catch (e) {
        this.$toastr.error(e);
      }

      this.loading = false;
    }
  }
};
</script>
