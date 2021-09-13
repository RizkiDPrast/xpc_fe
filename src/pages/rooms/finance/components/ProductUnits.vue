<template>
  <div style="padding: 8px;padding-top:unset;">
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="text-h6">Sub units (multiple units)</div>
        <div class="text-subtitle2"></div>
      </q-card-section>
      <q-card-section v-if="!product.id || product.id < 0">
        Please save current product
      </q-card-section>
      <q-card-section v-else>
        <q-card-actions vertical align="right">
          <q-btn flat outline label="Add" icon="las la-plus" @click="add" />
        </q-card-actions>
        <q-markup-table flat bordered>
          <thead>
            <tr>
              <td>Actions</td>
              <td>#</td>
              <td>Unit</td>
              <td>Unit Price</td>
              <td>Factor</td>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!product.productUnits || !product.productUnits.length">
              <td class="text-center" colspan="5">
                <p>No sub units for this product</p>
                <q-btn
                  flat
                  outline
                  label="Add"
                  icon="las la-plus"
                  @click="add"
                />
              </td>
            </tr>
            <tr v-else v-for="(item, ix) in data" :key="item.id">
              <td-action
                :id="item.id"
                :name="item.unitName"
                @edit="edit(item)"
                @delete="del(item)"
              />
              <td>{{ ix + 1 }}</td>
              <td>{{ item.unitName }}</td>
              <td>{{ item.unitPrice | money }}</td>
              <td>
                1 {{ item.unitName }} = {{ item.toBaseMultiplier }}
                {{ getUnitName(product.unitId) }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="modal" persistent>
      <q-card>
        <dialog-header>
          {{ title }} - {{ product.code || product.name }}
        </dialog-header>
        <!-- <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>
            {{ title }} - {{ product.code || product.name }}
          </q-toolbar-title>
          <q-btn flat round dense icon="las la-times" v-close-popup />
        </q-toolbar> -->
        <q-card-section class="row items-center">
          <unit-select
            class="col-12"
            v-model="model.unitId"
            name="unitId"
            :disable="deleteMode"
            v-validate="'required'"
            :error="errors.has('unitId')"
            :error-message="errors.first('unitId')"
            label="Unit"
            :ignore="ignore"
            outlined
          />
          <q-input
            class="col-12"
            :disable="deleteMode"
            v-model="model.toBaseMultiplier"
            name="toBaseMultiplier"
            v-validate="'required|decimal|min_value:0'"
            :error="errors.has('toBaseMultiplier')"
            :error-message="errors.first('toBaseMultiplier')"
            type="number"
            label="Factor"
            :hint="hint(model)"
            input-class="text-center"
            outlined
          >
          </q-input>

          <money-field
            class="col-12"
            :readonly="deleteMode"
            :disable="deleteMode"
            v-money="configs"
            name="unitPrice"
            label="Unit price"
            v-model="model.unitPrice"
            v-validate="'required'"
            :error="errors.has('unitPrice')"
            :error-message="errors.first('unitPrice')"
            outlined
          />
          <div class="q-field__messages" style="color: #b1b1b1;">
            <table>
              <tr>
                <td>1 {{ getUnitName(product.unitId) }}</td>
                <td>=</td>
                <td>
                  {{ product.sellingPrice | money }}
                </td>
              </tr>
              <tr v-if="model.unitId > -1">
                <td>1 {{ getUnitName(model.unitId) }}</td>
                <td>=</td>
                <td>
                  {{ model.unitPrice | money }}
                </td>
              </tr>
            </table>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="default" v-close-popup />
          <q-btn
            v-show="deleteMode"
            @click="deleteSubunit"
            flat
            label="Confirm delete"
            color="negative"
          />
          <q-btn
            v-show="!deleteMode"
            @click="updateSubunit"
            label="Save"
            color="primary"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Product from "src/models/Product";
import ProductUnit from "src/models/ProductUnit";

export default {
  name: "ProductUnits",
  props: {
    product: {
      type: Product,
      required: true
    }
  },
  data() {
    return {
      data: this.product.productUnits,
      modal: false,
      title: "Updating sub unit",
      model: new ProductUnit(),
      configs: this.$root.$options.moneyConfigs,
      deleteMode: false,
      loading: false
    };
  },
  computed: {
    ignore() {
      const ids =
        this.data && this.data.length ? this.data.map(x => x.unitId) : [];
      ids.push(this.product.unitId);
      return ids;
    }
  },
  watch: {
    product(val) {
      this.data = val.productUnits || [];
    }
  },
  methods: {
    add() {
      this.deleteMode = false;
      this.model = new ProductUnit();
      this.modal = true;
    },
    edit(item) {
      this.deleteMode = false;
      this.model = new ProductUnit(item);
      this.modal = true;
    },
    del(item) {
      this.deleteMode = true;
      this.model = new ProductUnit(item);
      this.modal = true;
    },
    async updateSubunit() {
      if (!(await this.$validator.validateAll())) return;
      if (this.loading) return;
      this.loading = true;
      const updating = this.model.id > 0;

      this.model.productId = this.product.id;
      this.model.baseUnitId = this.product.unitId;
      this.model.unitName = this.getUnitName(this.model.unitId);

      this.model.toBaseMultiplier = Number(this.model.toBaseMultiplier);

      try {
        var res = updating
          ? await this.$api.products.putUnit(this.model)
          : await this.$api.products.postUnit(this.model);
        if (updating) {
          this.data = this.data.map(x => (x.id === res.data.id ? res.data : x));
        } else {
          this.data.push(res.data);
        }
        this.modal = false;
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    },
    async deleteSubunit() {
      if (!(await this.$validator.validateAll())) return;
      if (this.loading) return;
      this.loading = true;
      try {
        var id = this.model.id;
        await this.$api.products.deleteUnit(this.model.id);
        this.data = this.data.filter(x => x.id !== id);
        this.modal = false;
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    },

    hint(model) {
      if (!model || !model.unitId || !(model.toBaseMultiplier > -1)) return "";
      return `1 ${this.getUnitName(model.unitId)} = ${model.toBaseMultiplier}
                ${this.getUnitName(this.product.unitId)}`;
    }
  }
};
</script>
