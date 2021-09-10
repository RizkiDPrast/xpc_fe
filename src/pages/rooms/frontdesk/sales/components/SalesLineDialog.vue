<template>
  <q-dialog :value="value" @input="dialogHandle" full-width persistent>
    <q-card>
      <q-form>
        <q-card-section title class="text-bold text-center">
          {{ title.toUpperCase() }}
        </q-card-section>
        <q-card-section>
          <q-input
            label="Product name"
            name="itemName"
            v-validate="'required'"
            :error="errors.has('itemName')"
            :error-message="errors.first('itemName')"
            v-model="model.itemName"
            :outlined="nameDisabled"
            :filled="!nameDisabled"
            :disable="nameDisabled"
            class="q-mb-xs"
          />
          <money-field
            label="Selling Price"
            filled
            v-model="model.unitPrice"
            class="q-mb-xs"
            dense
          >
            <template #after> / {{ model.unitName }} </template>
          </money-field>

          <money-field
            label="Discount"
            filled
            v-model="modelDiscount"
            percentToggle
            :valuePercent.sync="model.discountUnitInPercent"
            class="q-mb-xs"
            dense
          />

          <quantity-field v-model="model.qty" />
        </q-card-section>
        <q-card-section>
          <q-btn-group class="full-width">
            <q-btn
              label="Delete"
              text-color="negative"
              style="width:50%"
              @click="$emit('deleted', model)"
            />
            <q-btn
              label="Close"
              color="primary"
              style="width:50%"
              @click="$emit('cancel')"
            />
          </q-btn-group>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import SaleLine from "src/models/SaleLine";
export default {
  name: "sales-line-dialog",
  props: {
    title: {
      type: String,
      default: () => "item details"
    },
    salesLine: {
      type: Object,
      default: () => new SaleLine()
    },
    value: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {};
  },
  computed: {
    modelDiscount: {
      get() {
        if (this.model.discountUnitInPercent) {
          return this.model.percentDiscount;
        } else {
          return this.model.moneyDiscount;
        }
      },
      set(val) {
        if (this.model.discountUnitInPercent) {
          this.model.percentDiscount = val;
        } else {
          this.model.moneyDiscount = val;
        }
      }
    },
    nameDisabled() {
      return !!this.model.itemName && this.model.itemName.length > 0;
    },
    model: {
      get() {
        return this.salesLine;
      },
      set(val) {
        this.$emit("update:sales-line", val);
      }
    },
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
    dialogHandle(val) {
      this.$emit("input", val);
    }
  },
  mounted() {}
};
</script>
