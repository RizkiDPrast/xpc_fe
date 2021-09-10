<template>
  <div class="row full-width full-height">
    <div class="col-9 row">
      <q-btn
        :disable="disable"
        v-for="(item, i) in nums"
        :key="item"
        @click="addNum(item)"
        class="col-md-4"
        style="width:calc(100% / 3); font-size:2em"
        flat
      >
        <u v-if="i < nums.length - 2">{{ item }}</u>
        <span v-else> {{ item }}</span>
      </q-btn>
    </div>
    <div class="col-3 row">
      <q-btn
        :disable="disable"
        no-caps
        :icon="item.icon"
        v-for="item in sides"
        :color="item.color"
        :key="item.id"
        @click="item.click(item)"
        flat
        class="text-center"
        style="width:100%;font-size:1.5em"
      >
        <span v-html="item.label"></span>
      </q-btn>
    </div>

    <q-dialog v-model="chooseMoneyDialogOpen" full-width>
      <q-card>
        <q-card-section class="text-bold">
          Choose money
        </q-card-section>
        <q-card-section>
          <div class="row">
            <q-item
              class="col-sm-2 "
              v-for="item in indonesianMoneys"
              clickable
              :key="item"
              @click="useMoney(item)"
            >
              <q-card class="bg-blue-2 text-center" style="width:105px">
                <q-card-section>
                  <template v-if="typeof item === 'string'">
                    {{ item }}
                  </template>
                  <template v-else>
                    {{ item | money }}
                  </template>
                </q-card-section>
              </q-card>
            </q-item>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "money-keypad",
  props: {
    value: {
      type: Number,
      required: true
    },
    requiredMoney: {
      type: Number,
      default: () => 0
    },
    disable: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      nums: [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, "00", "."],
      sides: [
        {
          id: 0,
          label: "C",
          icon: undefined,
          click: () => {
            this.model = 0;
          }
        },
        {
          id: 1,
          label: "",
          icon: "las la-backspace",
          click: () => {
            this.backSpacePressed();
          }
        },
        {
          id: 2,
          label: "<span><u>R</u>p</spam>",
          icon: undefined,
          click: () => {
            this.chooseMoneyDialogOpen = true;
          }
        },
        {
          id: 3,
          label: "Save",
          color: "positive",
          icon: "las la-save",
          click: this.save
        }
      ],
      indonesianMoneys: ["Exact amount", 5000, 10000, 50000, 100000],
      chooseMoneyDialogOpen: false,
      useComma: false
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
  mounted() {
    this.initListeners();
  },
  destroyed() {
    this.removeListeners();
  },
  methods: {
    keyup(e) {
      if (e.altKey) {
        if (e.key === "b") {
          this.openMoneyDialog();
        }
      } else {
        if (e.key === "0") {
          this.addNum(e.key);
        }
        if (!isNaN(e.key)) {
          this.addNum(e.key);
        } else {
          if (e.key === "Enter") {
            this.save();
          } else if (e.key === "Backspace") {
            this.backSpacePressed();
          }
        }
      }
    },
    initListeners() {
      document.addEventListener("keyup", this.keyup);
    },
    removeListeners() {
      document.removeEventListener("keyup", this.keyup);
    },
    save() {
      this.$emit("ok", this.model);
    },
    addNum(val) {
      if (val === ".") {
        this.useComma = true;
        return;
      }

      let v;
      if (this.useComma) {
        this.useComma = false;
        v = Number(this.model.toString() + "." + val);
      } else {
        v = Number(this.model.toString() + val);
      }

      if (Number.isNaN(v)) {
        return;
      }

      this.model = v;
    },
    backSpacePressed() {
      let v = Number(
        this.model.toString().slice(0, this.model.toString().length - 1)
      );
      if (Number.isNaN(v)) {
        return;
      }
      this.model = v;
    },
    useMoney(val) {
      let v = Number(val);
      if (Number.isNaN(v)) {
        this.model = this.requiredMoney;
      } else {
        this.model = Number(val);
      }
      this.chooseMoneyDialogOpen = false;
    }
  }
};
</script>
