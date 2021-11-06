<template>
  <div>
    <q-list>
      <q-item style="margin-bottom: -0.8em;">
        <q-item-section side v-show="hasItem">
          <q-btn-toggle
            rounded
            size="xs"
            v-model="factor"
            :options="[
              { icon: 'las la-plus', value: 1 },
              { icon: 'las la-minus', value: -1 }
            ]"
          />
        </q-item-section>
      </q-item>
      <q-slide-item
        v-for="(item, ix) in model"
        :key="ix"
        :clickable="!item.itemUsageIds.length && !item.debtSaleId"
        @click.native="
          item.itemUsageIds.length || item.debtSaleId
            ? () => {}
            : itemClick(item)
        "
        right-color="negative"
        @right="e => deleteHandle(e, item)"
      >
        <template v-slot:right>
          <q-icon name="las la-trash" />
        </template>
        <q-item>
          <q-item-section side>
            <q-btn
              text-color="primary"
              class="shadow-1"
              unelevated
              :label="item.qty"
              size="lg"
              @click.stop="updateQty(item)"
              :disable="!!item.itemUsageIds.length || !!item.debtSaleId"
            />
          </q-item-section>
          <q-item-section title>
            <q-item-label overline>
              {{ item.itemName.replace("[null]", "") }}
            </q-item-label>
            <q-item-label caption>
              {{ item.qty }} *
              <template
                v-if="
                  !item.product ||
                    !item.product.productUnits ||
                    !item.product.productUnits.length
                "
              >
                {{ item.unitPrice | money }} / {{ getUnitName(item.unitId) }}
              </template>
              <q-btn-dropdown
                v-else
                outline
                flat
                color="primary"
                @click.stop
                no-caps
              >
                <template #label>
                  {{ item.unitPrice | money }} / {{ getUnitName(item.unitId) }}
                  <q-tooltip v-if="item.maxUnit">
                    Max: {{ item.maxUnit }}
                  </q-tooltip>
                </template>
                <q-list>
                  <q-item
                    :clickable="item.unitId !== item.product.unitId"
                    :style="
                      item.unitId !== item.product.unitId
                        ? ''
                        : 'color:var(--q-color-negative)!important'
                    "
                    v-close-popup
                    @click.stop="
                      item.maxUnit = item.product.qty;
                      item.qty = 1;

                      item.unitPrice = item.product.sellingPriceWithoutDisc;
                      item.moneyDiscount = item.product.discount;
                      item.percentDiscount = item.product.discountPercent;

                      item.unitId = item.product.unitId;
                      item.unitName = item.product.unitName;
                    "
                  >
                    <q-item-section>
                      <q-item-label>
                        {{ item.product.sellingPrice | money }} /
                        {{ getUnitName(item.product.unitId) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item
                    v-for="x in item.product.productUnits"
                    :key="x.id"
                    :clickable="
                      item.unitId !== x.unitId &&
                        (item.product.qty / x.toBaseMultiplier >= 1 ||
                          !item.product.trackInventory)
                    "
                    :style="
                      item.unitId !== x.unitId &&
                      (item.product.qty / x.toBaseMultiplier >= 1 ||
                        !item.product.trackInventory)
                        ? ''
                        : 'color:var(--q-color-negative)!important'
                    "
                    v-close-popup
                    @click.stop="
                      item.maxUnit = parseInt(
                        Math.floor(item.product.qty / x.toBaseMultiplier),
                        10
                      );
                      item.qty = 1;
                      item.unitPrice = x.unitPrice;
                      item.moneyDiscount = 0;
                      item.percentDiscount = 0;

                      item.unitId = x.unitId;
                      item.unitName = x.unitName;
                    "
                  >
                    <q-item-section>
                      <q-item-label>
                        {{ x.unitPrice | money }} /
                        {{ x.unitName }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <template v-if="item.hasDiscount">
                <span v-if="item.percentDiscount" class="text-red">
                  - {{ item.percentDiscount }}%</span
                >
                <span v-if="item.moneyDiscount" class="text-red">
                  - {{ item.moneyDiscount | money }}
                </span>
              </template>
              = <b> {{ item.rowTotal | money }} </b>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>
    <sales-line-dialog
      v-show="hasItem"
      v-model="dialogOpen"
      title="item details"
      :salesLine.sync="salesLine"
      @cancel="dialogOpen = false"
      @deleted="deleted"
    />
  </div>
</template>

<script>
import SalesLineDialog from "./SalesLineDialog";
import SaleLine from "src/models/SaleLine";
export default {
  name: "SalesLineList",
  props: {
    value: {
      type: Array,
      default: () => []
    },
    clientId: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      factor: 1,
      dialogOpen: false,
      salesLine: new SaleLine(),
      timeout: 2000
    };
  },
  methods: {
    itemClick(item) {
      this.salesLine = item;
      this.dialogOpen = true;
    },
    updateQty(item) {
      let nval = item.qty + 0.5 * this.factor;
      if (nval < 1) {
        return;
      }
      if (item.maxUnit && nval > item.maxUnit) {
        this.$toastr.warning(
          `${item.itemName} has ${item.maxUnit} ${item.unitName} remaining`
        );
        return;
      }
      let ix = this.model.indexOf(item);
      let updated = Object.assign({}, item, { qty: nval });
      this.model.splice(ix, 1, new SaleLine(updated));
    },
    deleteHandle(details, item) {
      let dismiss = this.$q.notify({
        message: "Item is removed",
        actions: [
          {
            label: "Undo",
            color: "white",
            handler: () => {
              clearTimeout(to);
              details.reset();
            }
          }
        ]
      });

      const ix = this.model.indexOf(item);
      let to = setTimeout(() => {
        dismiss();
        this.model.splice(ix, 1);
      }, this.timeout);
    },
    deleted(item) {
      this.dialogOpen = false;
      const ix = this.model.indexOf(item);
      this.model.splice(ix, 1);
    }
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        // console.log('val', val)
        this.$emit("input", val);
      }
    },
    hasItem() {
      return this.model.length > 0;
    }
  },
  components: {
    SalesLineDialog
  }
};
</script>
<style lang="stylus" scoped>
.q-item__section.column.q-item__section--main.justify-center:hover
  //background-color: $secondary
  //padding-left: 2px
  border: 1px solid dashed
</style>
