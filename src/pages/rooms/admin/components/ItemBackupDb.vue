<template>
  <q-item>
    <q-item-section avatar>
      <q-icon color="primary" name="las la-database" />
    </q-item-section>
    <q-item-section>
      <q-item-label title>
        Backup Database
      </q-item-label>
      <q-item-label caption>
        Create Xing Pet App Database Backup to folder of your choice
      </q-item-label>
    </q-item-section>
    <q-item-section side top>
      <q-btn outline color="primary" label="Backup" @click="backupDb" />
    </q-item-section>
  </q-item>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {};
  },
  computed: {
    loadingModel: {
      get() {
        return this.loading;
      },
      set(val) {
        this.$emit("update:loading", val);
      }
    }
  },
  methods: {
    async backupDb() {
      if (!(await this.confirm("Continue backing up XINGAPP Database?"))) {
        return;
      }
      if (this.loadingModel) return;
      this.loadingModel = true;
      try {
        await this.$api.server.backupDb();
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loadingModel = false;
    }
  }
};
</script>
