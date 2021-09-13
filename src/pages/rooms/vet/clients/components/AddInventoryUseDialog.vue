<template>
  <q-dialog v-model="model">
    <main-card>
      <template #header>
        <q-toolbar-title
          style="padding-left: 0;font-size:1.2em;overflow:visible"
          class="text-primary"
        >
          Tambah inventori rekam medik
        </q-toolbar-title>
      </template>
      <template #action-buttons>
        <q-btn icon="las la-times" v-close-popup size="sm" flat />
      </template>

      <q-form @submit="onSubmit">
        <q-card-section>
          <product-select
            label="Produk"
            v-model="inventoryUseModel.productId"
            name="productId"
            @selectedChanged="productSelectChanged"
            v-validate="'required'"
            :error="errors.has('productId')"
            :error-message="errors.first('productId')"
          />
          <q-input
            type="number"
            input-class="text-center"
            v-model="inventoryUseModel.qty"
            label="Qty"
            name="qty"
            min="1"
            v-validate="'required|min_value:0'"
            :error="errors.has('qty')"
            :error-message="errors.first('qty')"
          />
          <q-input
            disable
            name="unitId"
            label="Unit"
            class="col-6"
            v-model="inventoryUseModel.unitName"
            v-validate="'required'"
            :error="errors.has('unitId')"
            :error-message="errors.first('unitId')"
            filled
            dense
          />
          <!-- <money-field
            label="Total Harga"
            v-model="inventoryUseModel.lineCost"
            name="lineCost"
            v-validate="'required|min_value:0'"
            :error="errors.has('lineCost')"
            :error-message="errors.first('lineCost')"
          /> -->
          <money-field
            label="Harga per unit"
            v-model="inventoryUseModel.unitPrice"
            name="unitPrice"
            disable
            v-validate="'required|min_value:0'"
            :error="errors.has('lineCost')"
            :error-message="errors.first('lineCost')"
          />
          <q-field disable class="full-width" label="Total" stack-label>
            <template #control>
              <div class="full-width text-right text-green text-h5">
                {{ inventoryUseModel.lineTotal | money }}
              </div>
            </template>
          </q-field>
        </q-card-section>
        <q-card-section>
          <submit-button
            :loading="isLoading"
            class="full-width"
            @submit="onSubmit"
          />
        </q-card-section>
      </q-form>
    </main-card>
  </q-dialog>
</template>

<script>
import Product from "src/models/Product";
import InventoryUseForMedical from "src/models/InventoryUseForMedical";
export default {
  name: "AddInventoryUseDialog",
  props: {
    value: {
      type: Boolean,
      default: () => false
    },
    inventoryUseForMedical: {
      type: InventoryUseForMedical,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      inventoryUseModel: new InventoryUseForMedical(this.InventoryUseForMedical)
    };
  },
  watch: {
    inventoryUseForMedical(val) {
      this.inventoryUseModel = val;
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
    }
  },
  methods: {
    productSelectChanged(val) {
      if (val.unitId) {
        this.inventoryUseModel.productId = val.value;
        this.inventoryUseModel.productName = val.label;

        this.inventoryUseModel.unitId = val.unitId;
        this.inventoryUseModel.unitName = val.unitName;
        this.inventoryUseModel.unitPrice = val.sellingPrice;
        this.inventoryUseModel.unitCost = val.purchasingPrice;
      } else {
        this.inventoryUseModel.product = new Product();
        this.inventoryUseModel.unitId = undefined;

        this.inventoryUseModel.productName = undefined;
        this.inventoryUseModel.unitName = undefined;
        this.inventoryUseModel.unitPrice = 0;
        this.inventoryUseModel.unitCost = 0;
      }
    },
    async onSubmit() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      await this.$validator.validateAll();
      if (!this.errors.any()) {
        this.$emit("update:inventory-use-for-medical", this.inventoryUseModel);
        this.model = false;
      }
      this.isLoading = false;
    }
  }
};
</script>
