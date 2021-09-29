<template>
  <q-card>
    <q-toolbar>
      <q-toolbar-title>
        Server Management
      </q-toolbar-title>
    </q-toolbar>
    <q-card-section>
      <q-list separator>
        <backup-db-item :loading.sync="loading" />
        <item-restore-db :loading.sync="loading" />
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="las la-server" />
          </q-item-section>
          <q-item-section>
            <q-item-label title>
              Backup Files
            </q-item-label>
            <q-item-label caption>
              Compress and download all user uploaded files (User's avatars,
              Patient's avatars, and Signalement's attachments)
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-btn
              type="a"
              href="/api/server/backupFiles"
              target="_blank"
              outline
              color="primary"
              label="Backup"
            />
          </q-item-section>
        </q-item>
        <!-- <q-item>
                    <q-item-section avatar>
                        <q-icon color="positive" name="las la-server"/>
                    </q-item-section>
                    <q-item-section>
                        <q-item-label title>
                            Restore Files
                        </q-item-label>
                        <q-item-label caption>
                            Uncompress and restore all user uploaded files (User's avatars, Patient's avatars, and Signalement's attachments)
                        </q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                        <q-btn outline color="positive" label="Restore" @click="restoreFiles" />
                    </q-item-section>
                </q-item> -->

        <div style="height:100px"></div>
        <q-item>
          <q-item-section avatar>
            <q-icon color="negative" name="las la-lock" />
          </q-item-section>
          <q-item-section>
            <q-item-label title class="text-negative">
              Clear database
            </q-item-label>
            <q-item-label caption>
              Reset database to its initial state with default users and
              password
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-btn
              outline
              color="negative"
              label="Truncate"
              @click="truncate"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-dialog v-model="loading" persistent>
      <q-card style="width:400px;height:300px" class="bg-black">
        <q-card-section class="flex flex-center" style="height:300px;">
          <div>
            <q-spinner-gears size="150px" color="secondary" />
            <p class="text-center text-white no-padding q-mt-md">Please wait</p>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import BackupDbItem from "./ItemBackupDb.vue";
import ItemRestoreDb from "./ItemRestoreDb.vue";
export default {
  components: { BackupDbItem, ItemRestoreDb },
  name: "ServerManagementCard",
  data() {
    return {
      loading: false
    };
  },
  methods: {
    // async restoreFiles(){

    // },
    async truncate() {
      if (
        !(await this.confirm(
          "Warning ! This will clear all tables records and only create default users and password. This action is undone. Continue?",
          { ok: { color: "negative" } }
        ))
      ) {
        return;
      }
      if (this.loading) return;
      this.loading = true;
      try {
        await this.$api.server.truncateDb();
        this.$toastr.success("All tables was successfully cleared");
        this.$store.commit("auth/logout");
        this.$router.replace("/");
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    }
  }
};
</script>
