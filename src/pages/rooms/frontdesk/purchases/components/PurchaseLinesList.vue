<template>
  <q-list
    class="q-mb-md q-pb-md rounded-borders"
    style="border:1px solid #f1f1f1"
  >
    <q-toolbar>
      <q-toolbar-title>
        Items
      </q-toolbar-title>
      <q-space />
      <q-btn
        flat
        round
        icon="las la-plus"
        color="secondary"
        @click="addPurchaseLine"
        v-if="!purchase.id || purchase.id === 0"
      >
        <q-tooltip content-class="bg-secondary">
          Add item
        </q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-markup-table class="no-shadow">
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Item details</th>
          <th class="text-right">Cost</th>
          <th class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!model.length">
          <td class="text-left" colspan="4">No data</td>
        </tr>
        <tr v-for="(item, i) in model.filter(x => !x.forDeletion)" :key="i">
          <q-td>
            {{ i + 1 }}
          </q-td>
          <q-td>
            <q-item-label class="" v-if="item.itemName">
              {{ item.itemName }}
            </q-item-label>
            <q-item-label
              class=""
              v-else-if="item.product && item.product !== null"
            >
              {{ item.product.sku }} - {{ item.product.name }}
            </q-item-label>
            <q-item-label caption class="text-grey text-italic">
              {{ item.qty }} * {{ item.unitCost | money }} /
              {{ getUnitName(item.unitId) }}
            </q-item-label>
            <q-item-label caption v-if="item.expDate">
              exp at: {{ $util.toDateString(item.expDate) }}
            </q-item-label>
          </q-td>
          <q-td align="right">
            <span style="font-weight:bold;color:black">
              {{ item.lineCost | money }}
            </span>
          </q-td>
          <q-td class="text-right">
            <q-btn-group flat v-if="item.id <= 0">
              <q-btn
                flat
                round
                class="q-ml-sm"
                size="xs"
                icon="las la-pencil-alt"
                @click="editPurchaseLine(item)"
              />
              <q-btn
                flat
                round
                size="xs"
                icon="las la-trash"
                style="color:var(--q-color-negative)"
                @click="delPurchaseLine(item.id, item.itemName)"
              />
            </q-btn-group>
          </q-td>
        </tr>
      </tbody>
    </q-markup-table>

    <purchase-line-dialog
      v-model="dialogOpen"
      :purchaseLine.sync="purchaseLine"
      :units="units"
      @update:purchase-line="updatePurchaseLine"
    />
  </q-list>
</template>

<script>
import PurchaseLineDialog from "./PurchaseLineDialog";
import Purchase from "src/models/Purchase";
import PurchaseLine from "src/models/PurchaseLine";
export default {
  name: "PurchaseLineList",
  components: {
    PurchaseLineDialog
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    purchase: {
      type: Purchase,
      default: () => new Purchase()
    }
  },
  data() {
    return {
      dialogOpen: false,
      purchaseLine: new PurchaseLine()
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
  methods: {
    addPurchaseLine() {
      this.purchaseLine = new PurchaseLine({ id: this.model.length * -1 });
      this.dialogOpen = true;
    },
    editPurchaseLine(item) {
      this.purchaseLine = new PurchaseLine(item);
      this.dialogOpen = true;
    },
    delPurchaseLine(id, name) {
      if (confirm(`Are you sure want to delete this record ${name}?`)) {
        if (id < 1) {
          this.model = this.model.filter(x => x.id !== id);
        } else {
          this.model = this.model.map(x => {
            if (x.id === id) {
              x.forDeletion = true;
            }
            return x;
          });
        }
      }
    },
    updatePurchaseLine(val) {
      let fm = this.model.find(x => x.id === val.id);
      console.log(val, fm);
      if (fm) {
        this.model = this.model.map(x => (x.id === val.id ? val : x));
      } else {
        this.model.push(val);
      }
    }
  }
};
</script>
