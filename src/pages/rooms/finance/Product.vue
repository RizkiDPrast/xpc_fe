<template>
  <q-page padding>
    <page-header>
      <template #actions>
        <!-- <q-btn flat round dense icon="las la-ellipsis-v" /> -->
        <q-btn
          flat
          round
          dense
          icon="las la-tag"
          @click="showCategories = true"
        >
          <q-tooltip content-class="bg-secondary">
            Manage categories
          </q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="las la-pills" @click="showUnits = true">
          <q-tooltip content-class="bg-secondary">
            Manage units
          </q-tooltip>
        </q-btn>
      </template>
    </page-header>
    <div class="text-h6 q-mb-md">
      <q-btn flat icon="las la-arrow-left" @click="$router.back()" />
      {{ model.id ? "Update Product Id=" + model.id : "Create new product" }}
    </div>

    <div class="row">
      <div class="col-sm-12 col-md-7">
        <q-form @submit="onSubmit" class="row q-col-gutter-sm">
          <input type="hidden" name="id" :value="model.id" ref="fid" />
          <q-input
            outlined
            dense
            type="text"
            autofocus
            name="sku"
            label="SKU (Stock Keeping Unit)"
            class="text-uppercase  col-xs-12 col-sm-6"
            v-model="model.sku"
            v-validate="'required|max:25|remoteValSku:fid'"
            :error="errors.has('sku')"
            :error-message="errors.first('sku')"
          />
          <q-input
            outlined
            dense
            type="text"
            name="name"
            label="Product Name"
            class="text-capitalize col-xs-12 col-sm-6"
            v-model="model.name"
            v-validate="'required'"
            :error="errors.has('name')"
            :error-message="errors.first('name')"
          />

          <unit-select
            name="unitId"
            label="Unit"
            class="col-xs-12 col-sm-6"
            hint="Use smallest unit for base"
            v-model="model.unitId"
            v-validate="'required'"
            :error="errors.has('unitId')"
            :error-message="errors.first('unitId')"
            outlined
            dense
          />
          <category-select
            name="categoryId"
            label="Category"
            class="col-xs-12 col-sm-6"
            v-model="model.categoryId"
            v-validate="'required'"
            :error="errors.has('categoryId')"
            :error-message="errors.first('categoryId')"
            outlined
            dense
          />

          <money-field
            outlined
            dense
            v-money="configs"
            type="text"
            name="purchasingPrice"
            label="Purchasing Price"
            class="col-xs-12 col-sm-6"
            v-model="model.purchasingPrice"
            v-validate="'required'"
            :error="errors.has('purchasingPrice')"
            :error-message="errors.first('purchasingPrice')"
            hint="average of purchasing price"
          />
          <money-field
            outlined
            dense
            type="text"
            name="netPrice"
            label="Nett price"
            class="col-xs-12 col-sm-6"
            v-model="model.netPrice"
            v-validate="'required'"
            :error="errors.has('netPrice')"
            :error-message="errors.first('netPrice')"
          />

          <div class="row col-12">
            <div class="col-xs-6 col-sm-4 q-pa-sm">
              <money-field
                outlined
                dense
                color="positive"
                label-color="positive"
                type="text"
                name="markup"
                label="+ Markup price"
                v-model="model.markup"
                v-validate="'required'"
                :error="errors.has('markup')"
                :error-message="errors.first('markup')"
              />
            </div>
            <div class="col-xs-6 col-sm-4 q-pa-sm">
              <money-field
                outlined
                dense
                v-money="configs"
                color="positive"
                label-color="positive"
                type="text"
                name="markupPercent"
                label="+ Markup price %"
                v-model="model.markupPercent"
                v-validate="'required'"
                :error="errors.has('markupPercent')"
                :error-message="errors.first('markupPercent')"
              />
            </div>
            <div class="col-xs-6 col-sm-4 q-pa-sm">
              <money-field
                outlined
                dense
                v-money="configs"
                color="positive"
                label-color="positive"
                type="text"
                name="productionCost"
                label="+ Production cost"
                v-model="model.productionCost"
                v-validate="'required'"
                :error="errors.has('productionCost')"
                :error-message="errors.first('productionCost')"
              />
            </div>

            <div class="col-xs-6 col-sm-4 q-pa-sm">
              <money-field
                outlined
                dense
                v-money="configs"
                color="negative"
                label-color="negative"
                type="text"
                name="discount"
                label="- Discount"
                v-model="model.discount"
                v-validate="'required'"
                :error="errors.has('discount')"
                :error-message="errors.first('discount')"
              />
            </div>
            <div class="col-xs-6 col-sm-4 q-pa-sm">
              <money-field
                outlined
                dense
                color="negative"
                label-color="negative"
                type="text"
                name="discountPercent"
                label="- Discount %"
                v-model="model.discountPercent"
                v-validate="'required'"
                :error="errors.has('discountPercent')"
                :error-message="errors.first('discountPercent')"
              />
            </div>
            <q-banner class="col-12 bg-grey-2 text-grey-6 q-mb-md text-sm">
              <i>Discount and Discount % will be shown on receipt.</i>
            </q-banner>
          </div>

          <div
            class="col-12 flex-center text-center text-bold text-h5 text-white bg-grey q-pa-md"
          >
            Selling Price:
            {{ model.sellingPrice | money }}
          </div>

          <div class="row q-col-gutter-sm">
            <q-input
              ref="qty"
              :disable="!createMode && !model.trackInventory"
              outlined
              dense
              type="number"
              name="qty"
              :label="qtyLabel"
              class="col-6"
              v-model="model.qty"
              v-validate=""
              :error="errors.has('qty')"
              :error-message="errors.first('qty')"
            />

            <q-input
              outlined
              dense
              type="number"
              name="minimumQty"
              label="Minimum Qty"
              class="col-6"
              v-model="model.minimumQty"
              v-validate="'min_value:0'"
              :error="errors.has('minimumQty')"
              :error-message="errors.first('minimumQty')"
            />
            <q-toggle
              @input="trackInput"
              v-model="model.trackInventory"
              name="trackInventory"
              label="Manage inventory"
              class="col-4"
              color="positive"
            />
            <q-toggle
              v-model="model.petShopProduct"
              name="pethop"
              label="Pet Shop Product?"
              class="col-4"
              color="positive"
            />
            <q-toggle
              v-model="model.discontinued"
              name="discontinued"
              label="Discontinued"
              class="col-4"
              color="red"
            />
          </div>
          <submit-button
            :is-loading="isLoading"
            @click="onSubmit"
            class="q-mt-md col-12 full-width"
          />
        </q-form>
      </div>
      <div class="col-sm-12 col-md-5">
        <product-units :product="model" />
      </div>
    </div>
    <!-- end row -->

    <units-dialog v-model="showUnits" />
    <categories-dialog v-model="showCategories" />
  </q-page>
</template>

<script>
import Product from "src/models/Product";
import ProductUnits from "./components/ProductUnits";

export default {
  description: "Product",
  props: {
    value: {
      type: Product,
      default: () => new Product()
    },
    id: {
      type: [String, Number],
      default: () => undefined
    }
  },
  components: {
    ProductUnits
  },
  data() {
    return {
      isLoading: false,
      model: new Product(this.value),
      configs: this.$root.$options.moneyConfigs,
      showUnits: false,
      showCategories: false
    };
  },
  watch: {
    "model.netPrice"(val) {
      // console.log('model.netPrice', val)
    },
    "model.unitId"(val, oval) {
      if (val > 0 && oval) {
        this.$toastr.warning(
          "After changing Base unit, make sure to stock check current product"
        );
      }
    }
  },
  computed: {
    createMode() {
      return !this.model || !this.model.id;
    },
    qtyLabel() {
      return this.createMode ? "Initial Stock" : "Current Stock";
    }
  },
  mounted() {
    if (this.id && Number(this.id)) {
      this.fetch();
    }
  },
  methods: {
    trackInput(val) {
      if (val) {
        this.$toastr.warning("Please update current stock");
        this.$nextTick(() => {
          this.$refs.qty.focus();
        });
      }
    },
    async fetch() {
      if (!this.id) return;
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        var res = await this.$api.products.getOne(this.id);
        this.model = new Product(res.data);
      } catch (e) {
        this.$toastr.error(e);
      }
      this.isLoading = false;
    },
    async onSubmit() {
      await this.$validator.validateAll();
      if (this.errors.any()) {
        this.$toastr.error("Please correct the form then resubmit");
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      this.model.sku = this.model.sku.toUpperCase();
      var data = this.model;
      data.qty = Number(data.qty);
      data.minimumQty = Number(data.minimumQty);
      try {
        const isEditing = data.id > 0;
        var res = await (isEditing
          ? this.$api.products.put(data.id, data)
          : this.$api.products.post(data));
        console.log("res.data", res.data);
        if (res.status < 300) {
          this.$toastr.success(
            `${data.id > 0 ? "Record updated" : "Record added"}`
          );
          if (data.id) {
            this.$router.back();
          } else {
            this.$router.replace(`/app/rooms/products/${res.data.id}`);
          }
        } else {
          this.$toastr.error(res.statusText);
        }
      } catch (e) {
        this.$toastr.error(e);
        this.$store.commit(
          "addErrors",
          this.$util.errModelState(e.response.data.modelState)
        );
      }

      this.isLoading = false;
    },
    async fetchUnits() {
      try {
        var res = await this.$api.units.get();
        this.unitModels = res.data;
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
    },
    async fetchCategories() {
      try {
        var res = await this.$api.categories.get();
        this.categoryModels = res.data;
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
    },
    getUnitName(id) {
      let model = this.unitModels.find(x => x.id === id);
      return model ?? "";
    },
    getCategoryName(id) {
      let model = this.categoryModels.find(x => x.id === id);
      return model ?? "";
    }
  }
};
</script>

<style></style>
