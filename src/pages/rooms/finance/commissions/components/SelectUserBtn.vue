<template>
  <div>
    <q-btn
      flat
      icon="las la-users"
      label="Select employee"
      color="secondary"
      @click="model = true"
    />
    <q-dialog v-model="model">
      <q-card>
        <dialog-header title="Select an employee to check" />
        <q-card-section>
          <my-table
            title=""
            :loading="loading"
            :data="data"
            :columns="columns"
            row-key="id"
            :pagination.sync="pager"
            :filter="filter"
            @request="fetch"
            @row-click="click"
            addBtnClass="hidden"
          >
            <template #body-cell-avatar="props">
              <q-td class="text-center" :class="{selected: props.row.id === user.id}">
                <user-avatar :value="props.row" size="sm" />
              </q-td>
            </template>
          
          </my-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import DialogHeader from "src/components/DialogHeader.vue";
export default {
  components: { DialogHeader },
  name: "SelectUserBtn",
  props: {
    value: {
      type: Boolean,
      default: () => false
    },
    user: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      sid: undefined,
      data: [],
      columns: [
      
        {
          name: "avatar",
          label: "Avatar",
          field: "avatar",
          align: "center"
        },
        {
          name: "userName",
          label: "Name",
          field: "userName",
          align: "left",
          format: (val, row) =>
            row.displayName && row.displayName !== null ? row.displayName : val
        },
        {
          name: "roleName",
          label: "Role",
          field: "roleName",
          align: "left"
        },
        {
          name: "Notes",
          label: "Notes",
          field: "notes",
          align: "left"
        }
      ],
      pager: {
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0
      },
      filter: undefined
    };
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
  },
  watch: {
    sid(val) {
         if (!val) return undefined;

      let user = this.data.find(x => x.id === this.sid);
      this.$emit("update:user", user);
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
      click(ev, row){
          this.sid = row.id
          this.model = false
      },
    async fetch(pager) {
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      try {
        var res = await this.$api.users.get(pager);
        var dt = res.data;
        this.data = dt.rows.map(x => x);

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
    }
  }
};
</script>
<style lang="scss" scoped>
.selected {
  border-left: 5px solid var(--q-color-positive);
}
</style>
