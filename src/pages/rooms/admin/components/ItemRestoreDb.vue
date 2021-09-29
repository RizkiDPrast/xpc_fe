<template>
  <q-item>
    <q-item-section avatar>
      <q-icon color="positive" name="las la-database" />
    </q-item-section>
    <q-item-section>
      <q-item-label title>
        Restore Database
      </q-item-label>
      <q-item-label caption>
        Restore Xing Pet App Database from backup file
      </q-item-label>
    </q-item-section>
    <q-item-section side top>
      <q-btn outline color="positive" label="Restore" @click="confirmRestore" />
    </q-item-section>

    <q-file
      accept=".sql"
      style="display:none;"
      ref="file"
      v-model="file"
      @input="restoreDb"
    />
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
    return {
      file: undefined
    };
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
    async confirmRestore() {
      if (this.loadingModel) return;
      if (!(await this.confirm("Continue restoring XINGAPP Database?"))) {
        return;
      }
      let ifile = this.$refs.file.$el.querySelector(`input[type="file"]`);
      this.file = "";
      ifile.value = "";
      // ifile.value = null;
      // console.log(ifile);
      // this.$refs.file.$el.onchange();
      this.$refs.file.$el.click();
    },
    async restoreDb(file) {
      if (!file || !file.name) {
        return;
      }

      let fd = new FormData();
      fd.append("file", file);

      if (this.loadingModel) return;
      this.loadingModel = true;
      try {
        await this.$api.server.restoreDb(fd);
        this.$toastr.success("Database restore is complete");
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loadingModel = false;
    }
  }
};
</script>
