<template>
  <q-dialog v-model="model" maximized>
    <q-card style="max-height:100vh row;flex-direction:column; display:flex">
      <q-toolbar class="bg-primary text-white">
        <q-btn flat icon="las la-arrow-left" @click="model = false" />
        <q-input
          debounce="500"
          clearable
          standout
          dark
          v-model="search"
          dense
          class="full-width"
          placeholder="Filter client"
          @input="fetchItems"
          :loading="isLoading"
          autofocus
        >
          <template #append>
            <q-icon name="las la-search" />
          </template>
        </q-input>
      </q-toolbar>
      <q-card-section>
        <template v-if="clientModel.id">
          Selected: {{ clientModel.code }} --
          {{ clientModel.name }}
          <q-btn
            size="sm"
            round
            flat
            icon="las la-times"
            title="remove"
            @click="removeSelected"
          />
        </template>
        <q-list>
          <div
            v-for="item in data"
            :key="item.customerSelectData"
            class="selectable cursor-pointer"
            @click="pickItem(item)"
            :class="{ focused: data.indexOf(item) === focusedNum }"
          >
            <q-tooltip content-class="bg-purple text-white">
              shortcuts:
              <p>
                <i class="las la-arrow-up"></i> /
                <i class="las la-arrow-down"></i> to navigate
              </p>
              <p><i>[Enter] </i> to select</p>
            </q-tooltip>
            <q-item dense>
              <q-item-section title>
                <q-item-label class="text-bold">
                  {{ item.code }} - {{ item.name }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  size="sm"
                  color="primary"
                  label="Select"
                  @click="pickItem(item)"
                />
              </q-item-section>
            </q-item>
            <q-separator />
          </div>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import Client from "src/models/Client";
export default {
  name: "add-client-in-receipt-dialog",
  props: {
    value: {
      type: Boolean,
      default: () => false
    },
    client: {
      type: Client,
      default: () => new Client()
    }
  },
  data() {
    return {
      focusedNum: undefined,
      search: "",
      data: [],
      clientModel: this.client,
      isLoading: false
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
    }
  },
  watch: {
    client(val) {
      this.clientModel = new Client(val);      
    },
    value(val) {
      if (val) {
        this.initListeners();
      } else {
        this.removeListeners();
      }
    }
  },
  destroyed() {
    this.removeListeners();
  },
  methods: {
    keyUp(e) {
      if (e.key === "ArrowDown") {
        if (this.data.length) {
          if (this.focusedNum === undefined) {
            this.focusedNum = 0;
          } else {
            let n = this.focusedNum + 1;
            let ln = this.data.length;
            if (n >= ln) {
              this.focusedNum = 0;
            } else {
              this.focusedNum = n;
            }
          }
        }
      }
      if (e.key === "ArrowUp") {
        if (this.data.length) {
          if (this.focusedNum === undefined) {
            this.focusedNum = this.data.length - 1;
          } else {
            let n = this.focusedNum - 1;
            if (n < 0) {
              this.focusedNum = this.data.length - 1;
            } else {
              this.focusedNum = n;
            }
          }
        }
      }
      if (e.key === "Enter") {
        if (this.focusedNum > -1) {
          let item = this.data.find((x, i) => i === this.focusedNum);
          if (!item) return;
          this.pickItem(item);
        }
      }
    },
    initListeners() {
      document.addEventListener("keyup", this.keyUp);
    },
    removeListeners() {
      document.removeEventListener("keyup", this.keyUp);
    },
    async fetchItems() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        var res = await this.$api.clients.get({
          filter: this.search,
          rowsPerPage: 20
        });
        this.data = res.data.rows.map(x => new Client(x));
      } catch (e) {
        this.$toastr.error("Failed getting data");
      }
      this.isLoading = false;
    },
    pickItem(item) {
      this.$emit("update:client", new Client(item));
      this.model = false;
    },
    removeSelected() {
      this.$emit("update:client", undefined);
      this.model = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
.selectable:hover,
.focused {
  background-color: #8080801a;
}
</style>
