<template>
  <div>
    <q-dialog v-model="model" full-width>
      <q-card>
        <q-toolbar class="bg-primary full-width">
          <q-input
            debounce="500"
            dense
            clearable
            dark
            standout
            class="full-width"
            placeholder="Find a Product ..."
            v-model="search"
            autofocus
          >
            <template #append>
              <q-icon name="las la-search" />
            </template>
          </q-input>
          <q-btn
            icon="las la-plus"
            label="New Product"
            size="sm"
            text-color="white"
            flat
            @click="addProductDialog = true"
          />
        </q-toolbar>
        <q-card-section v-if="isLoading" class="row flex-center">
          <q-circular-progress color="primary" indeterminate size="lg" />
        </q-card-section>
        <q-card-section v-else-if="!data.length">
          {{
            search && search.length
              ? "No Products found " + search
              : "No Product"
          }}
        </q-card-section>
        <q-card-section v-else>
          <q-list>
            <div
              v-for="item in data"
              :key="item.id"
              class="selectable cursor-pointer"
              :class="{ focused: data.indexOf(item) === focusedNum }"
              @click.stop="pickProduct(item)"
            >
              <q-tooltip content-class="bg-purple text-white">
                shortcuts:
                <p>
                  <i class="las la-arrow-up"></i> /
                  <i class="las la-arrow-down"></i> to navigate
                </p>
                <p><i>[Enter] </i> to select</p>
              </q-tooltip>
              <q-item dense>
                <q-item-section side>
                  <q-btn
                    icon="las la-plus"
                    size="sm"
                    @click.stop="pickProduct(item)"
                    :disable="item.trackInventory && item.qty < 1"
                  />
                </q-item-section>
                <q-item-section title>
                  <q-item-label
                    overline
                    class="text-bold"
                    style="font-size:1.3em"
                  >
                    {{ item.sku }}
                    <span v-if="item.sku && item.skulength">-</span>
                    {{ item.name }}
                    <small v-if="item.notes && item.notes !== null">
                      {{ item.notes }}
                    </small>
                  </q-item-label>
                  <q-item-label
                    style="margin-top:-3px"
                    v-show="item.trackInventory"
                    caption
                  >
                    <small>
                      ({{ item.qty }}
                      {{ getUnitName(item.unitId).toLowerCase() }} remaining)
                    </small>
                  </q-item-label>
                  <q-item-label caption>
                    {{ getCategoryName(item.categoryId) }}
                    <q-badge v-if="item.hasDiscount" class="bg-negative">
                      with discount
                    </q-badge>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <small v-if="item.notes && item.notes.length"
                    ><i style="font-size:smaller"> {{ item.notes }} </i>
                  </small>
                </q-item-section>
                <q-item-section side>
                  <span class="text-bold text-h6">
                    {{ item.sellingPrice | money }} /

                    {{ getUnitName(item.unitId).toLowerCase() }}
                    <span v-if="item.productUnit && item.productUnit.length">
                      *
                      <q-tooltip>
                        having {{ item.productUnit.length }} sub unit(s)
                      </q-tooltip></span
                    >
                  </span>
                </q-item-section>
              </q-item>
              <q-separator />
            </div>
          </q-list>
        </q-card-section>
        <q-toolbar>
          <q-space />
          <q-btn label="cancel" v-close-popup color="primary" />
        </q-toolbar>
      </q-card>
    </q-dialog>

    <add-product-dialog v-model="addProductDialog" @added="productAdded" />
  </div>
</template>

<script>
import SaleLine from "src/models/SaleLine";
import Product from "src/models/Product";
import AddProductDialog from "./AddProductDialog";
export default {
  name: "search-Item-dialog",
  components: {
    AddProductDialog
  },
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      focusedNum: undefined,
      isLoading: false,
      search: "",
      data: [],
      relatedPicDialog: false,
      relatedPics: [],
      selectedProduct: {},
      addProductDialog: false
    };
  },
  methods: {
    keyup(e) {
      if (e.key === "ArrowDown") {
        if (this.data.length) {
          if (this.focusedNum === undefined) {
            this.focusedNum = 0;
          } else {
            let n = this.focusedNum + 1;
            let ln = this.data.length;
            if (n >= ln) {
              this.focusedNum = 0;
            } else {
              this.focusedNum = n;
            }
          }
        }
      }
      if (e.key === "ArrowUp") {
        if (this.data.length) {
          if (this.focusedNum === undefined) {
            this.focusedNum = this.data.length - 1;
          } else {
            let n = this.focusedNum - 1;
            if (n < 0) {
              this.focusedNum = this.data.length - 1;
            } else {
              this.focusedNum = n;
            }
          }
        }
      }
      if (e.key === "Enter") {
        if (this.focusedNum > -1) {
          let item = this.data.find((x, i) => i === this.focusedNum);
          if (!item) return;
          this.pickProduct(item);
        }
      }
    },
    initListeners() {
      document.addEventListener("keyup", this.keyup);
    },
    removeListeners() {
      document.removeEventListener("keyup", this.keyup);
    },
    async fetchProducts() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        var res = await this.$api.products.get(false, {
          inStockOnly: true,
          filter: this.search,
          rowsPerPage: 25
        });
        this.data = res.data.rows.map(x => new Product(x));
      } catch (e) {
        this.$toastr.error("Failed getting data");
      }
      this.isLoading = false;
    },
    pickProduct(item) {
      this.selectedProduct = item;
      this.relatedPics = [];

      var sl = new SaleLine(item);
      sl.productId = item.id;
      sl.itemName = "[" + item.sku + "] " + item.name;
      sl.unitCost = item.purchasingPrice;
      sl.qty = 1;

      //sl.unitPrice = item.sellingPrice;
      sl.unitPrice = item.sellingPriceWithoutDisc;
      sl.moneyDiscount = item.discount;
      sl.percentDiscount = item.discountPercent;

      item.unitName = this.getUnitName(item.unitId);
      sl.maxUnit = item.qty;
      sl.product = item;
      sl.unitId = item.unitId;
      sl.unitName = this.getUnitName(item.unitId);

      this.$emit("item-picked", sl);
      this.model = false;
    },
    productAdded(product) {
      // console.log(Product)
      var sl = new SaleLine(product);
      sl.productId = product.id;
      if (product.sku && product.sku.length) {
        sl.product = "[" + product.sku + "] " + product.name;
      }
      sl.itemName = product.name;
      sl.unitCost = product.purchasingPrice;
      sl.unitPrice = product.sellingPrice;
      sl.qty = 1;

      sl.product = undefined;
      sl.unitId = product.unitId;
      sl.unitName = this.getUnitName(product.unitId);

      this.$emit("item-picked", sl);
      this.model = false;
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
  watch: {
    search() {
      this.fetchProducts();
    },
    value(val) {
      if (val) {
        this.initListeners();
      } else {
        this.removeListeners();
      }
    }
  },
  mounted() {},
  destroyed() {
    this.removeListeners();
  }
};
</script>

<style lang="stylus" scoped>
.selectable:hover,
.focused {
  background-color: #8080801a;
}
</style>
