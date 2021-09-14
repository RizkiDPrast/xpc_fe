<template>
  <q-expansion-item v-bind="$attrs" v-model="expanded">
    <template v-slot:header>
      <q-item-section avatar>
        <q-avatar icon="las la-horse" text-color="primary" />
      </q-item-section>
      <q-item-section>
        {{ petPanelTitle }}
        <span class="text-sm"> {{ petPanelCaption }} </span>
      </q-item-section>

      <q-item-section side>
        <div class="row items-center">
          <!-- <q-btn
            round
            flat
            :icon="isAddingPetMode ? 'las la-undo' : 'las la-plus'"
            :title="isAddingPetMode ? 'las la-undo' : 'las la-plus'"
            @click.stop="isAddingPetMode = !isAddingPetMode"
            :disabled="!canAddPet"
          /> -->
          <patient-btn
            icon="las la-plus"
            round
            flat
            :value="patient"
            :clientId="clientId"
            @input="newPetAdded"
          />
        </div>
      </q-item-section>
    </template>
    <q-card>
      <q-card-section style="padding-left:0;padding-right:0;">
        <!-- <client-pets-table
          :clientId="clientId"
          :isAdding.sync="isAddingPetMode"
          @selected-row-change="selectedChanged"
          @update:editing-row="petEditingModeHandle"
        /> -->
        <q-table
          flat
          row-key="id"
          :data="data"
          :columns="columns"
          :loading="loading"
          @request="fetch"
          :pagination.sync="pager"
          class="table"
        >
          <template #body="props">
            <q-tr
              :props="props"
              class="cursor-pointer"
              :class="{ selected: props.row.id === selected.id }"
              @click.native="selected = props.row"
            >
              <q-td key="actions" :props="props">
                 <patient-to-boarding-btn :patientId="props.row.id" size="sm" round color="accent" flat />  
                 
                <patient-btn
                  @click.stop="selected = props.row"
                  icon="las la-pencil-alt"
                  round
                  flat
                  size="sm"
                  :value="props.row"
                  @input="petUpdated"
                  text-color="positive"
                  :clientId="clientId"
                />

                <q-btn
                  round
                  flat
                  icon="las la-trash-alt"
                  title="Delete"
                  text-color="negative"
                  size="sm"
                  :disable="loading"
                  @click.stop="del(props.row.id)"
                />
              </q-td>

              <q-td align="center" style="width:50px">
                <patient-avatar :value="props.row" size="sm" />
              </q-td>
              <q-td key="animalTypeId" :props="props">
                {{ getAnimalTypeName(props.row.animalTypeId) }}
              </q-td>
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="sex" :props="props">
                {{ getSexType(props.row.sex) }}
              </q-td>
              <q-td key="doB" :props="props" class="">
                {{ props.row.age }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import Patient from "src/models/Patient";
export default {
  name: "ClientPetsExpansionCard",
  components: {},
  inheritAttrs: false,
  props: {
    clientId: {
      type: Number,
      default: () => 0
    },
    value: {
      type: Object,
      default: () => ({})
    },
    patientId: {
      type: [Number, String],
      default: () => undefined
    }
  },
  data() {
    return {
      expanded: true,
      loading: false,
      patient: new Patient({ clientId: this.clientId }),
      data: [],
      columns: [
        {
          name: "actions",
          align: "center",
          field: "action",
          label: "Actions",
          style: "width:25px"
        },
        {
          name: "avatar",
          field: "avatar",
          label: "Avatar"
        },
        {
          name: "animalTypeId",
          align: "left",
          field: "animalTypeId",
          label: "Type",
          sortable: true,
          style: ""
        },
        {
          name: "name",
          align: "left",
          field: "name",
          label: "Name",
          sortable: true,
          format: (val, row) => val
        },
        {
          name: "sex",
          align: "left",
          field: "sex",
          label: "Sex",
          format: val => this.getSexType(val)
        },
        {
          name: "doB",
          align: "center",
          field: "doB",
          label: "doB",
          sortable: false,
          style: "width:25px"
        }
      ],
      pager: { rowsPerPage: 15 }
    };
  },
  computed: {
    selected: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    petPanelTitle() {
      return (
        "Pets" +
        (!this.selected.id
          ? ""
          : `: ${this.getAnimalTypeName(this.selected.animalTypeId)} ${
              this.selected.name
            }`)
      );
    },
    petPanelCaption() {
      let tday = new Date();
      return !this.selected.id ? "" : this.selected.age;
    }
  },
  watch: {
    clientId() {
      this.fetch();
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
    newPetAdded(model) {
      this.data.push(model);
    },
    petUpdated(model) {
      this.data = this.data.map(x => (x.id === model.id ? model : x));
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
            var res = await this.$api.patients.delete(id);
            if (res.status === 200) {
              this.data = this.data.filter(val => val.id !== id);
              this.$toastr.success("Record was deleted");
              this.selected = {};
            }
          } catch (e) {
            this.$toastr.error(e.message);
          } finally {
            this.loading = false;
          }
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    },
    async fetch() {
      if (!this.clientId) return;
      this.loading = true;
      try {
        const res = await this.$api.patients.getByClient({
          clientId: this.clientId
        });
        let data = res.data.map(x => new Patient(x));
        if (data.length > 0) {
          if (this.patientId && !isNaN(Number(this.patientId))) {
            var sel = data.find(x => x.id === Number(this.patientId));
            if (sel) {
              this.selected = sel;
            } else {
              this.selected = data[0];
            }
          } else {
            this.selected = data[0];
          }
        }
        this.data.splice(0, this.data.length, ...data);
      } catch (e) {
        this.$toastr.error(e.message);
      }
      this.loading = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
tr.selected td
  background-color: #8080801a;
.table {
  min-height:450px;
}
</style>
