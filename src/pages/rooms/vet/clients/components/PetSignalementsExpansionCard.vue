<template>
  <q-expansion-item v-model="expanded" v-if="patient.id">
    <template v-slot:header>
      <q-item-section avatar>
        <q-avatar icon="las la-calendar-week" text-color="primary" />
      </q-item-section>
      <q-item-section>
        <span v-html="signalementPanelTitle"></span>
        <span class="text-sm"> {{ signalementPanelCaption }} </span>
      </q-item-section>
      <q-item-section side>
        <div class="row items-center">
          <signalement1-btn
            round
            flat
            icon="las la-plus"
            :value="newModel"
            @input="signalementAdded"
          />
        </div>
      </q-item-section>
    </template>
    <q-card>
      <q-card-section style="padding-left:0;padding-right:0">
        <q-table
          dense
          flat
          row-key="id"
          :pagination.sync="pager"
          :data="data"
          :columns="columns"
          :loading="loading"
          @request="onRequest"
          class="table"
        >
          <template #body="props">
            <q-tr
              :props="props"
              :class="{
                selected: props.row.id === selected.id
              }"
              class="cursor-pointer"
              @click.native="selected = Object.assign({}, props.row)"
            >
              <q-td key="actions" class="text-center">
                <template
                  v-if="props.row.lockedAt && props.row.lockedAt !== null"
                >
                  <q-icon name="las la-lock" />
                </template>
                <template v-else>
                  <signalement1-btn
                    @click.stop="selected = props.row"
                    round
                    flat
                    icon="las la-pencil-alt"
                    :value="props.row"
                    @input="signalementUpdated"
                    color="positive"
                  />
                  <q-btn
                    round
                    flat
                    icon="las la-trash"
                    title="Delete"
                    color="negative"
                    :disable="loading"
                    @click.stop="del(props.row.id)"
                  />
                </template>
              </q-td>
              <q-td key="visitDate">
                {{ $util.formatDate(props.row.visitDate, "YYYY/MM/DD") }}
              </q-td>
              <q-td key="weight">
                {{ props.row.weight > 0 ? props.row.weight + " kg" : "-" }}
              </q-td>
              <q-td key="temp">
                {{ props.row.temp > 0 ? props.row.temp + " °C" : "-" }}
              </q-td>
              <q-td key="resp">
                {{ props.row.resp > 0 ? props.row.resp + " bpm" : "-" }}
              </q-td>
              <q-td key="pulse">
                {{ props.row.pulse > 0 ? props.row.pulse + " bpm" : "-" }}
              </q-td>
              <q-td key="treatedBy">
                <user-badge :id="props.row.treatedBy" />
              </q-td>
              <q-td key="action" align="center ">
                <q-btn
                  flat
                  dense
                  round
                  icon="las la-ellipsis-v"
                  class="text-primary"
                  v-if="props.row.action > 0"
                >
                  <q-menu>
                    <q-list>
                      <q-item
                        v-if="props.row.formPasienId > 0"
                        clickable
                        @click="
                          $emit(
                            'open-form',
                            props.row.formPasienId,
                            props.row.actionString
                          )
                        "
                        v-close-popup
                      >
                        <q-item-section>
                          <q-item-label title>
                            Open
                            <span v-if="props.row.action !== 7">consent</span>
                            form
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item
                        clickable
                        @click="$emit('open-in-patient-board', props.row.id)"
                      >
                        <q-item-section>
                          <q-item-label title>
                            Open Form Rawat Inap
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
                <q-badge class="bg-secondary">
                  {{ props.row.actionString }}
                </q-badge>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import Signalement1Btn from "pages/components/buttons/Signalement1Btn";
import Patient from "src/models/Patient";
export default {
  name: "PetSignalementsExpansionCard",
  components: {
    Signalement1Btn
  },
  props: {
    patient: {
      type: Object,
      default: () => new Patient()
    },
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      expanded: true,
      pager: {
        page: 1,
        rowsPerPage: 5,
        sortBy: "visitDate",
        descending: true
      },
      columns: [
        {
          name: "actions",
          align: "center",
          field: "action",
          label: "Actions",
          style: "width:25px"
        },
        {
          name: "visitDate",
          align: "center",
          field: "visitDate",
          label: "Visit date",
          sortable: true,
          style: ""
        },
        {
          name: "weight",
          align: "center",
          field: "weight",
          label: "Weight",
          sortable: false,
          format: val => val
        },
        {
          name: "temp",
          align: "center",
          field: "temp",
          label: "Temp",
          sortable: false
        },
        {
          name: "resp",
          align: "center",
          field: "resp",
          label: "Resp",
          sortable: false
        },
        {
          name: "pulse",
          align: "center",
          field: "pulse",
          label: "Pulse",
          sortable: false
        },
        {
          name: "treatedBy",
          align: "center",
          field: "treatedBy",
          label: "Treated by",
          sortable: false
        },
        {
          name: "action",
          align: "center",
          field: "actionString",
          label: "Final action",
          sortable: false
        }
      ],
      data: []
    };
  },
  computed: {
    newModel() {
      return { patientId: this.patient.id, visitDate: new Date() };
    },
    selected: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    signalementPanelTitle() {
      let arr = ["Visit date and vital signs "];
      if (this.patient.id > 0) {
        arr.push(
          "<b>" +
            this.$util.safeString(
              " for " +
                this.getAnimalTypeName(this.patient.animalTypeId) +
                " " +
                this.patient.name +
                (this.selected.visitDate
                  ? ` @ ${this.$util.formatDate(
                      this.selected.visitDate,
                      "dddd, YYYY-MM-DD"
                    )}`
                  : "")
            ) +
            "</b>"
        );
      }
      return arr.join("");
    },
    signalementPanelCaption() {
      return `${this.selected.weight > 0 ? this.selected.weight + " kg" : ""}
          ${this.selected.temp > 0 ? this.selected.temp + " °C" : ""}
          ${this.selected.resp > 0 ? this.selected.resp + " bpm" : ""}
          ${this.selected.pulse > 0 ? this.selected.pulse + " bpm" : ""}
        `;
    }
  },
  mounted() {
    this.onRequest();
  },
  watch: {
    "patient.id"(val) {
      if (val) {
        this.onRequest();
      }
    },
    value(val) {
      this.data = this.data.map(x => (x.id === val.id ? val : x));
    }
  },
  methods: {
    signalementAdded(model) {
      this.data.push(model);
      this.selected = model;
    },
    signalementUpdated(model) {
      this.data = this.data.map(x => (x.id === model.id ? model : x));
      this.selected = model;
    },
    async onRequest() {
      if (this.patient.id === 0) {
        this.data = [];
      }
      if (this.loading) return;
      this.loading = true;
      try {
        const res = await this.$api.signalements.get(this.patient.id);
        let data = res.data.map(x => x);
        data.sort((a, b) =>
          a.visitDate > b.visitDate
            ? -1
            : a.visitDate < b.visitDate
            ? 1
            : a.id >= b.id
            ? -1
            : 1
        );
        console.log(data.map(x => x.id));
        if (data.length > 0) {
          this.selected = Object.assign({}, data[0]);
          console.log("id", this.selected.id, data[0], data);
        } else {
          this.selected = {};
        }

        this.data.splice(0, this.data.length, ...data);
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
      this.loading = false;
      return Promise.resolve();
    },
    del(id) {
      this.$q
        .dialog({
          title: "Confirm",
          message: `Are you sure want to delete record Id = ${id}?`,
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          this.loading = true;
          try {
            var res = await this.$api.signalements.delete(id);
            if (res.status < 300) {
              this.data = this.data.filter(val => val.id !== id);
              this.$toastr.success("Record was deleted");
              this.selected = {};
            }
          } catch (e) {
            this.$toastr.error(e);
          } finally {
            this.loading = false;
          }
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    }
  }
};
</script>
<style lang="stylus" scoped>
tr.selected td
  background-color: #8080801;
.table {
  min-height:225px;
}
</style>
