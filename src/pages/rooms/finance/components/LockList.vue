<template>
  <q-card flat style="width:500px;">
    <dialog-header title="Monthly Locks" />
    <q-toolbar>
      <q-btn
        class="q-px-md"
        text-color="negative"
        rounded
        dense
        icon="las la-plus"
        label="Create new lock"
        :disable="loading"
      >
        <q-popup-edit v-model="date" @save="datePicked">
          <date-input
            label="Pick lock date"
            v-model="date"
            hint="hit enter when done"
          />
        </q-popup-edit>
      </q-btn>
      <q-tooltip content-class="bg-negative">
        Lock monthly commission<br />
        (will be active before 11th and after or equal 25th of every month)
      </q-tooltip>
      <q-toolbar-title></q-toolbar-title>
      <q-btn
        round
        size="sm"
        icon="las la-sync"
        @click="fetch"
        :loading="loading"
        dense
      />
    </q-toolbar>
    <q-table :data="data" :columns="columns" flat :loading="loading">
      <template #body-cell-action="scope">
        <q-td>
          <!-- <q-btn
            v-if="data.length && data.indexOf(scope.row) === 0"
            round
            size="sm"
            icon="las la-trash-alt"
            text-color="negative"
            @click="del(scope.row.id)"
          /> -->
          <q-btn
            round
            size="sm"
            icon="las la-trash-alt"
            :text-color="
              data.length && data.indexOf(scope.row) === 0 ? 'negative' : ''
            "
            @click="del(scope.row.id)"
          />
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>

<script>
import DialogHeader from "src/components/DialogHeader.vue";
import DateInput from "src/components/DateInput.vue";
export default {
  components: { DialogHeader, DateInput },
  name: "LockList",
  data() {
    return {
      data: [],
      columns: [
        {
          name: "createdAt",
          field: "createdAt",
          label: "CreatedAt",
          align: "left",
          format: val =>
            this.$util.formatDate(val, "DD MMM YY HH:mm:ss") + " WIB"
        },
        {
          name: "action",
          label: "#",
          align: "center"
        }
      ],
      loading: false,
      date: new Date(),
      dateDialog: false
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch() {
      if (this.loading) return;
      this.loading = true;
      try {
        let res = await this.$api.finance.getLocks();
        this.data = res.data;
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    },
    async del(id) {
      if (
        await this.confirm(
          `You are going to delete <strong>the Lock record</strong>? <br>Continue?`
        )
      ) {
        try {
          await this.$api.finance.deleteLock(id);
          this.$toastr.success("Records was deleted");
          this.data = this.data.filter(x => x.id !== id);
        } catch (error) {
          this.$toastr.error(error);
        }
      }
    },
    async pickDate() {
      this.dateDialog = true;
    },
    datePicked(val) {
      this.date = val;
      this.add();
    },
    async add() {
      if (this.loading) return;
      this.loading = true;

      var d = new Date(this.date);
      var cr = new Date();
      d.setHours(cr.getHours());
      d.setMinutes(cr.getMinutes());
      d.setSeconds(cr.getSeconds());
      d.setMilliseconds(cr.getMilliseconds());

      // if (d.getDate() < 10) {
      //   d.setMonth(d.getMonth() - 1);
      // }
      var f = this.$util.formatDate(d, "DD MMMM YYYY HH:mm:ss") + " WIB";
      if (
        await this
          .confirm(`This action will create lock at <b>${f}</b>. This will affect following:\n
            <ul>
                <li>User commission datas for the spesified month</li>
                <li>TreatedBy, GroomedBy, and AssistedBy fields in Signalement table created at the spesified month</li>
                <li>In-patient-treatment-board datas commission for the spesified month</li>
            </ul>\nContinue?`)
      ) {
        try {
          await this.$api.finance.lockMonthlyCommissions(d);
          this.$toastr.success("Records was updated");
          this.loading = false;
          await this.fetch();
        } catch (error) {
          this.$toastr.error(error);
        }
      }
      this.loading = false;
    }
  }
};
</script>
