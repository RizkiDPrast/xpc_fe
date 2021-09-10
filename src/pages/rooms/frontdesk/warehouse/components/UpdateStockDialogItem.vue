<template>
  <span>
    <q-item clickable @click="model = true">
      <q-item-section>
        Update current stock
      </q-item-section>
    </q-item>
    <q-dialog v-model="model">
      <q-card style="width: 500px">
        <dialog-header title="Update current stock" />
        <q-card-section v-if="modelInput.product">
          <q-banner class="bg-grey-3">
            Total stock of this product = {{ modelInput.product.qty }}
            {{ getUnitName(modelInput.product.unitId) }}
            <p v-if="purchaseCode">Purchasing code: {{ purchaseCode }}</p>
          </q-banner>
        </q-card-section>
        <q-card-section>
          <q-form @submit="save">
            <product-select
              :value="modelInput.productId"
              name="product"
              class="q-mb-sm"
              label="Product"
              autocomplete="off"
              dense
              outlined
              readonly
            />

            <unit-select
              :value="modelInput.unitId"
              name="email"
              class="q-mb-sm"
              label="Unit"
              autocomplete="off"
              dense
              outlined
              readonly
            />

            <q-input
              :value="modelInput.stockIn"
              class="q-mb-sm"
              outlined
              label="Stock in"
              autocomplete="off"
              dense
              readonly
            />
            <q-input
              :value="modelInput.stockIn - modelInput.stockInOut"
              class="q-mb-sm"
              outlined
              label="Stock out"
              autocomplete="off"
              dense
              readonly
            />
            <q-input
              v-model="modelInput.stockInOut"
              style="margin-bottom:-4px;"
              outlined
              label="Stock In Out"
              autocomplete="off"
              dense
              name="stock"
              v-validate="'required|decimal'"
              :error="errors.has('stock')"
              :error-message="errors.first('stock')"
            />

            <q-input
              v-model="modelInput.note"
              style="margin-bottom:-6px;"
              outlined
              label="Note"
              autocomplete="off"
              dense
              name="note"
              v-validate="'required'"
              :error="errors.has('note')"
              :error-message="errors.first('note')"
            />

            <date-input
              v-model="modelInput.expDate"
              outlined
              label="Expired at"
              autocomplete="off"
              dense
              name="expDate"
              v-validate="''"
              :error="errors.has('expDate')"
              :error-message="errors.first('expDate')"
            />

            <q-btn
              :loading="loading"
              icon="las la-save"
              label="Save"
              title="Save"
              text-color="white"
              class="full-width q-mt-md"
              color="secondary"
              :disable="loading"
              @click.stop="save"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </span>
</template>

<script>
export default {
  props: {
    stockJournal: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      model: false,
      modelInput: JSON.parse(JSON.stringify(this.stockJournal)),
      purchaseCode: undefined
    };
  },
  watch: {
    stockJournal(val) {
      this.modelInput = JSON.parse(JSON.stringify(val));
    },
    model(val) {
      if (val && this.modelInput.purchaseLineId) {
        this.getPurchaseCode(this.modelInput.purchaseLineId);
      }
    }
  },
  methods: {
    async getPurchaseCode(id) {
      try {
        var res = await this.$api.purchaseLines.getPurchaseCode(id);
        this.purchaseCode = res.data;
      } catch (e) {}
    },
    async save() {
      if (!(await this.$validator.validateAll())) {
        this.$toastr.error("Pleae recheck form");
        return;
      }
      if (this.loading) return;
      this.loading = true;
      this.modelInput.stockIn = Number(this.modelInput.stockIn);
      this.modelInput.stockInOut = Number(this.modelInput.stockInOut);
      this.modelInput.stockOut =
        this.modelInput.stockIn - this.modelInput.stockInOut;

      try {
        var res = await this.$api.stocks.postJournal(this.modelInput);
        this.$toastr.success("Stock was updated");
        this.model = false;
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    }
  }
};
</script>
