<template>
  <q-dialog v-model="model" persistent>
    <q-card
      title=" Edit Product Purchase"
      style="width:500px!important;max-width:calc(100vw - 25px)!important"
    >
      <dialog-header title="Input Product Purchase" />

      <q-card-section>
        <q-form @submit="onSubmit">
          <product-select
            label="Product"
            v-model="purchaseLineModel.productId"
            name="productId"
            @selectedChanged="productSelectChanged"
            v-validate="''"
            :error="errors.has('productId')"
            :error-message="errors.first('productId')"
            show-all
            outlined
            dense
          />
          <q-input
            label="Item name"
            name="itemName"
            hint="product's name / transport fee, etc"
            v-show="
              !purchaseLineModel.productId || purchaseLineModel.productId < 0
            "
            v-model="purchaseLineModel.itemName"
            v-validate="'required'"
            :error="errors.has('productId')"
            :error-message="errors.first('productId')"
            outlined
            dense
          />

          <date-input
            label="Expired at"
            class="q-mt-sm q-mb-md"
            dense
            outlined
            v-model="purchaseLineModel.expDate"
            name="expDate"
          />

          <unit-select
            name="unitId"
            label="Unit"
            class="col-6"
            v-model="purchaseLineModel.unitId"
            v-validate="'required'"
            :error="errors.has('unitId')"
            :error-message="errors.first('unitId')"
            outlined
            dense
            :include="availUnits"
          />
          <q-input
            type="number"
            input-class="text-center"
            v-model="purchaseLineModel.qty"
            label="Qty"
            name="qty"
            min="1"
            v-validate="'required|min_value:0'"
            :error="errors.has('qty')"
            :error-message="errors.first('qty')"
            outlined
            dense
          />
          <money-field
            label="Total cost"
            v-model="purchaseLineModel.lineCost"
            name="lineCost"
            v-validate="'required|min_value:0'"
            :error="errors.has('lineCost')"
            :error-message="errors.first('lineCost')"
            outlined
            dense
          />
          <q-field disable class="full-width" label="Unit cost" stack-label>
            <template #control>
              <div class="full-width text-right text-green text-h5">
                {{ purchaseLineModel.unitCost | money }} /
                {{ selectedUnitName }}
              </div>
            </template>
          </q-field>

          <submit-button
            :loading="isLoading"
            class="full-width"
            @submit="onSubmit"
          >
            Add
          </submit-button>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import PurchaseLine from "src/models/PurchaseLine";
import Product from "src/models/Product";
export default {
  name: "PurchaseLineDialog",
  props: {
    value: {
      type: Boolean,
      default: () => false
    },
    purchaseLine: {
      type: PurchaseLine,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      purchaseLineModel: new PurchaseLine(this.purchaseLine),
      availUnits: []
    };
  },
  watch: {
    purchaseLine(val) {
      this.purchaseLineModel = val;
    },
    "purchaseLineModel.productId"(val) {
      if (!val) {
        this.purchaseLineModel.unitId = 1;
        this.purchaseLineModel.Product = null;
      }
    }
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    selectedUnitName: {
      get() {
        if (!this.units.length || !this.purchaseLineModel.unitId) {
          return undefined;
        }
        var un = this.units.find(x => x.id === this.purchaseLineModel.unitId);
        return un ? un.name : undefined;
      },
      set(val) {
        let m = this.units.find(x => x.code === val);
        if (m) {
          this.purchaseLineModel.unitId = m.id;
        } else {
          this.purchaseLineModel.unitId = 1;
        }
      }
    }
  },
  methods: {
    productSelectChanged(val) {
      if (val.unitId >= 0) {
        this.purchaseLineModel.product = val;
        this.purchaseLineModel.itemName = val.name;
        this.purchaseLineModel.unitId = val.unitId;
      } else {
        this.purchaseLineModel.product = new Product();
        this.purchaseLineModel.unitId = 1;
        val.unitId = 1;
      }

      if (Array.isArray(val.productUnits)) {
        this.availUnits = val.productUnits.map(x => x.id);
        this.availUnits.unshift(val.unitId);
      } else {
        this.availUnits = [val.unitId];
      }
    },
    async onSubmit() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      await this.$validator.validateAll();
      if (!this.errors.any()) {
        this.purchaseLineModel.qty = Number(this.purchaseLineModel.qty);
        this.$emit("update:purchase-line", this.purchaseLineModel);
        this.model = false;
      }
      this.isLoading = false;
    }
  }
};
</script>
