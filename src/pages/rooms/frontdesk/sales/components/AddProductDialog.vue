<template>
  <q-dialog v-model="dialogOpen">
    <q-card>
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>
          Create new Product
        </q-toolbar-title>
        <q-btn flat size="sm" icon="las la-times" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <q-form @submit="onSubmit" class="row q-col-gutter-sm">
          <input type="hidden" name="id" :value="model.id" ref="fid" />
          <q-input
            filled
            dense
            type="text"
            autofocus
            name="sku"
            label="SKU (Stock Keeping Unit)"
            hint="Leave blank if it is not required to be stored  in inventory"
            class="text-uppercase col-6"
            v-model="model.sku"
            v-validate="'max:25|remoteValSku:fid'"
            :error="errors.has('sku')"
            :error-message="errors.first('sku')"
          />
          <q-input
            filled
            dense
            type="text"
            name="name"
            label="Product Name"
            class="text-capitalize col-6"
            v-model="model.name"
            v-validate="'required'"
            :error="errors.has('name')"
            :error-message="errors.first('name')"
          />
          <div class="col-12"></div>
          <unit-select
            name="unitId"
            label="Unit"
            class="col-6"
            v-model="model.unitId"
            v-validate="'required'"
            :error="errors.has('unitId')"
            :error-message="errors.first('unitId')"
            filled
            dense
          />
          <category-select
            name="categoryId"
            label="Category"
            class="col-6"
            v-model="model.categoryId"
            v-validate="'required'"
            :error="errors.has('categoryId')"
            :error-message="errors.first('categoryId')"
            filled
            dense
          />

          <money-field
            filled
            dense
            type="text"
            name="purchasingPrice"
            label="Purchasing Price"
            class="col-6"
            v-model="model.purchasingPrice"
            v-validate="'required'"
            :error="errors.has('purchasingPrice')"
            :error-message="errors.first('purchasingPrice')"
          />
          <money-field
            filled
            dense
            type="text"
            name="netPrice"
            label="Nett price"
            class="col-6"
            v-model="model.netPrice"
            v-validate="'required'"
            :error="errors.has('netPrice')"
            :error-message="errors.first('netPrice')"
          />

          <div
            class="col-12 flex-center text-center text-bold text-h5 text-white bg-grey q-pa-md"
          >
            Selling Price:
            {{ model.sellingPrice | money }}
          </div>
          <submit-button
            :is-loading="isLoading"
            @click="onSubmit"
            class="q-mt-md col-12"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import Product from "src/models/Product";

export default {
  name: "add-Product-dialog",
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      animalTypes: [],
      model: new Product(),
      isLoading: false
    };
  },
  computed: {
    dialogOpen: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    async onSubmit() {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      await this.$validator.validateAll();
      if (!this.errors.any()) {
        var data = new Product(this.model);
        try {
          if (data.sku && data.sku.length && data.sku.trim() !== "") {
            this.model.sku = this.model.sku.toUpperCase();
            var res = await this.$api.products.post(data);
            data = new Product(res.data);
            this.$toastr.success(
              `${data.id > 0 ? "Record updated" : "Record added"}`
            );
          }

          this.$emit("added", data);
          this.dialogOpen = false;
        } catch (e) {
          this.$toastr.error(this.$util.err(e));
          this.$store.commit(
            "addErrors",
            this.$util.errModelState(e.response.data.modelState)
          );
        }
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    }
  },
  mounted() {}
};
</script>
