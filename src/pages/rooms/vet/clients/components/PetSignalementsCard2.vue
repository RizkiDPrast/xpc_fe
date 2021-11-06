<template>
  <q-card class="q-mt-sm" :class="{ editing: isEditing }">
    <q-toolbar>
      <q-avatar icon="las la-book" text-color="primary" />

      <q-toolbar-title class="text-h6" style="font-size:18px;" v-html="title">
      </q-toolbar-title>

      <span v-show="model.id && model.id > 0">
        <template v-if="model.lockedAt && model.lockedAt !== null">
          <q-icon name="las la-lock" class="q-mr-md" />
        </template>
        <template v-else>
          <q-btn
            flat
            round
            text-color="primary"
            :icon="isEditing ? 'las la-undo' : 'las la-pencil-alt'"
            @click="toggleEdit"
          />
          <q-btn
            round
            flat
            text-color="primary"
            v-show="isEditing"
            icon="las la-save"
            @click="save"
          />
        </template>
      </span>
      <action-select
        style="min-width:150px;"
        class="q-mt-md"
        v-model="model.action"
        outlined
        dense
        name="action"
        label="Final action"
        behavior="dialog"
        standout
        :readonly="!isEditing || ori.action > 0 || (!isVet && !isAdmin)"
        v-validate="'required'"
        :error="errors.has('action')"
        :error-message="errors.first('action')"
      >
        <q-tooltip content-class="bg-secondary">
          One time update and only a veterinarian should update
        </q-tooltip>
      </action-select>
    </q-toolbar>
    <span v-show="model.id && model.id > 0">
      <q-card-section class="row q-col-gutter-sm">
        <user-select
          stack-label
          label="Treated by"
          :roleNames="['Veterinarian']"
          v-model="model.treatedBy"
          dense
          outlined
          class="col-6"
          :readonly="!isEditing"
        />
        <user-select
          stack-label
          label="Groomed by"
          v-model="model.groomedBy"
          dense
          outlined
          class="col-6"
          :readonly="!isEditing"
        />

        <user-select
          multiple
          stack-label
          label="Assisted by"
          v-model="model.assistants"
          dense
          outlined
          class="col-12"
          :readonly="!isEditing"
        />
      </q-card-section>
      <q-card-section>
        <div class="row full-width q-col-gutter-sm">
          <div class="col-sm-4 col-xs-12">
            <q-input
              ref="inpAnamnesa"
              v-model="model.anamnesis"
              name="anamnesa"
              label="Anamnesa"
              v-validate="'max:255'"
              :error="errors.has('anamnesa')"
              :error-message="errors.first('anamnesa')"
              outlined
              dense
              :readonly="!isEditing"
              type="textarea"
              rows="4"
            />
          </div>
          <div class="col-sm-4 col-xs-12">
            <q-input
              v-model="model.clinicalSign"
              name="clinicalSign"
              label="Clinical sign"
              v-validate="'max:255'"
              :error="errors.has('clinicalSign')"
              :error-message="errors.first('clinicalSign')"
              outlined
              dense
              :readonly="!isEditing"
              type="textarea"
              rows="4"
            />
          </div>
          <div class="col-sm-4 col-xs-12">
            <q-input
              treatment
              v-model="model.treatment"
              name="treatment"
              label="Treatment"
              v-validate="'max:255'"
              :error="errors.has('treatment')"
              :error-message="errors.first('treatment')"
              outlined
              dense
              :readonly="!isEditing"
              type="textarea"
              rows="4"
            />
          </div>

          <div class="col-sm-6 col-xs-12">
            <q-input
              v-model="model.diagnose"
              name="diagnose"
              label="Diagnose"
              v-validate="'max:255'"
              :error="errors.has('diagnose')"
              :error-message="errors.first('diagnose')"
              outlined
              dense
              :readonly="!isEditing"
              type="textarea"
              rows="2"
            />
          </div>
          <div class="col-sm-6 col-xs-12">
            <q-input
              v-model="model.notes"
              name="notes"
              label="Notes"
              v-validate="'max:255'"
              :error="errors.has('notes')"
              :error-message="errors.first('notes')"
              outlined
              dense
              :readonly="!isEditing"
              type="textarea"
              rows="2"
            />
          </div>

          <div class="col-12 row full-width q-mt">
            <q-toolbar>
              <q-icon name="las la-paperclip" />
              <q-toolbar-title class="">
                Attachments
              </q-toolbar-title>
              <add-attachment-btn :id="ori.id" @added="added" />
            </q-toolbar>
            <q-list class="full-width">
              <q-item v-for="item in files" :key="item.id">
                <q-item-section avatar top>
                  <q-avatar
                    icon="las la-paperclip"
                    color="grey"
                    text-color="white"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">
                    <a :href="item.fileUri" target="__blank">
                      {{ item.fileName }} -
                      {{ $util.humanStorageSize(item.fileSize) }}
                    </a>
                  </q-item-label>
                  <q-item-label caption>
                    <!-- {{ item.fileType }} -->
                    <p>
                      {{ item.description }}
                    </p>
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    flat
                    round
                    icon="las la-trash-alt"
                    @click="deleteFile(item.id)"
                    color="negative"
                  >
                    <q-tooltip content-class="bg-negative">
                      Delete attachment
                    </q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
    </span>
  </q-card>
</template>

<script>
import AddAttachmentBtn from "./AddAttachmentBtn";
import ActionSelect from "./ActionSelect";
export default {
  name: "PetSignalementsCard2",
  components: {
    AddAttachmentBtn,
    ActionSelect
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      isEditing: false,
      model: {},
      ori: {}
    };
  },
  watch: {
    value(val) {
      var s = JSON.stringify(val);
      this.ori = JSON.parse(s);
      this.model = JSON.parse(s);
      // console.log("ori", this.ori);
      // console.log(this.model.weight)
      this.fetchAttachments();
      if (this.isEditing) {
        this.toggleEdit();
      }
    }
  },
  computed: {
    title() {
      let arr = ["Medical records "];
      if (this.model.id > 0) {
        // arr.push(
        //   "<b>" +
        //     this.$util.safeString(
        //       ` @ ${this.$util.formatDate(
        //         this.model.visitDate,
        //         "dddd, YYYY-MM-DD"
        //       )}`
        //     ) +
        //     "</b>"
        // );
      }
      return arr.join("");
    },
    files() {
      if (!this.ori.appFiles || !Array.isArray(this.ori.appFiles)) return [];
      return this.ori.appFiles;
    }
  },
  methods: {
    async fetchAttachments() {
      if (!this.ori.id) return;
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.signalements.getAttachments(this.ori.id);
        for (let f of res.data) {
          this.added(f);
        }
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    },
    added(nfile) {
      this.ori.appFiles = this.ori.appFiles || [];
      this.ori.appFiles.push(nfile);
    },
    async deleteFile(id) {
      if (!confirm("Are you sure want to delete this attachment?")) return;
      if (!this.ori.id) return;
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.signalements.deleteAttachment({
          signalementId: this.ori.id,
          id
        });
        this.$toastr.success("attachment was deleted");
        this.ori.appFiles = this.ori.appFiles || [];
        this.ori.appFiles = this.ori.appFiles.filter(x => x.id !== id);
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    },
    async save() {
      try {
        var m = this.model;
        if (m.weight) {
          m.weight = Number(m.weight);
        }
        if (m.temp) {
          m.temp = Number(m.temp);
        }
        if (m.resp) {
          m.resp = Number(m.resp);
        }
        if (m.pulse) {
          m.pulse = Number(m.pulse);
        }

        for (let a of m.assistants) {
          a.signalementId = this.value.id;
        }

        var res = await this.$api.signalements.putSignalement(m);
        if (
          res.data.formPasien !== null &&
          res.data.formPasien &&
          res.data.formPasien.id
        ) {
          this.$emit("new-form-added", res.data.formPasien);
        }

        this.$toastr.success("Medical record was updated");
        this.isEditing = false;
        this.$emit("input", JSON.parse(JSON.stringify(res.data)));
      } catch (e) {
        this.$toastr.error(e);
      }
    },
    // uploaded({ files }) {
    //   if (!this.justUploaded.find(x => x === this.model.id)) {
    //     this.justUploaded.push(this.model.id);
    //   }
    //   var file = files[0];
    //   this.model.fileName = file.name;
    //   this.model.fileSize = file.size;
    //   this.model.fileType = file.type;
    //   this.model.fileUri = JSON.parse(file.xhr.response).fileUri;
    //   this.$emit("input", this.model);
    //   this.$toastr.success("File was uploaded");
    // },
    toggleEdit() {
      this.isEditing = !this.isEditing;
      if (this.isEditing) {
        // TODO:ref  focus not working
        this.$refs.inpAnamnesa.focus();
      } else {
        this.model = JSON.parse(JSON.stringify(this.ori));
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.img
  width: 100%!important
.editing
  border-left:5px solid $negative
</style>
