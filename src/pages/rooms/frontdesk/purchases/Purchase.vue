<template>
  <q-page padding style="max-width:800px;">
    <page-header>
      <template #actions>
        <q-btn
          flat
          round
          icon="las la-truck-moving"
          color="accent"
          @click="showSuppliers = true"
        >
          <q-tooltip content-class="bg-accent">
            Supplier list
          </q-tooltip>
        </q-btn>
      </template>
    </page-header>
    <supplier-dialog v-model="showSuppliers" />

    <q-toolbar class="">
      <q-btn flat icon="las la-arrow-left" @click="$router.back()" />
      <q-toolbar-title>
        {{
          model.id > 0
            ? "Details of Purchase Id=" + model.id
            : "Create new Purchase "
        }}
      </q-toolbar-title>
      {{ today() }}
    </q-toolbar>
    <q-card
      style="max-width:800px;"
      :title="
        model.id > 0
          ? 'Details Purchase Id=' + model.id
          : 'Create new Purchase '
      "
      class="q-pa-md no-shadow"
      bordered
    >
      <template v-if="reloading">
        <q-circular-progress indeterminate size="lg" />
      </template>
      <q-form @submit="onSubmit" v-else class="row q-col-gutter-xs">
        <date-input
          readonly
          v-model="model.purchaseDate"
          name="purchaseDate"
          label="Purchasing date"
          maxToday
          v-validate="'required'"
          :error="errors.has('purchaseDate')"
          :errorMessage="errors.first('purchaseDate')"
          dense
          :disable="!formEnabled"
          outlined
          class="col-sm-6 col-md-4"
        />
        <q-input
          outlined
          dense
          type="text"
          autofocus
          name="invoiceNumber"
          label="Invoice Number"
          v-model="model.invoiceNumber"
          v-validate="'required|max:100'"
          :error="errors.has('invoiceNumber')"
          :error-message="errors.first('invoiceNumber')"
          :disable="!formEnabled"
          class="text-capitalize col-sm-6 col-md-4"
          autocomplete="off"
        />

        <!-- <q-input
          outlined
          dense
          type="text"
          autofocus
          name="supplier"
          label="Supplier"
          v-model="model.supplier"
          v-validate="'max:255'"
          :error="errors.has('supplier')"
          :error-message="errors.first('supplier')"
          :disable="!formEnabled"
          class="col-sm-12 col-md-4"
        /> -->
        <supplier-select
          outlined
          dense
          type="text"
          autofocus
          name="supplier"
          label="Supplier"
          v-model="model.supplierId"
          v-validate="'max:255'"
          :error="errors.has('supplier')"
          :error-message="errors.first('supplier')"
          :disable="!formEnabled"
          class="col-sm-12 col-md-4"
          @update="val => (model.supplierName = val.name)"
        />

        <purchase-lines-list
          v-model="model.purchaseLines"
          :purchase="model"
          class="col-12"
        />

        <div class="col-6">
          <q-card bordered>
            <q-card-section>
              <div>
                <q-badge :color="model.isPaid ? 'positive' : 'negative'">
                  Status
                </q-badge>
              </div>
              <q-toggle
                :readonly="
                  submitting || (model.paidAt && model.paidAt !== null)
                "
                v-model="model.isPaid"
                :label="model.isPaid ? 'PAID' : 'UNPAID'"
                :color="model.isPaid ? 'positive' : ''"
                :class="model.isPaid ? 'text-positive' : 'text-negative'"
              />
              <small v-if="model.paidAt"> @ {{ model.createdAt }} </small>
              <account-select
                :readonly="
                  submitting || (model.paidAt && model.paidAt !== null)
                "
                v-if="model.isPaid"
                dense
                outlined
                autocomplete="off"
                v-model="model.accountCode"
                label="Credit Account Code"
                hint="Bank / Cash account used to purchase"
                name="accountCode"
                class="text-capitalize account"
                startWith="1100"
                v-validate="'required'"
                :error="errors.has('accountCode')"
                :error-message="errors.first('accountCode')"
              />
              <q-btn
                class="float-right"
                color="secondary"
                style="margin-top:12px;"
                size="sm"
                v-if="model.isPaid && model.paidAt == null"
                @click="updateStatus"
                label="Update Status"
              />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-6 q-gutter-sm column items-end">
          <q-input
            type="number"
            label="Total item"
            v-model="model.totalQty"
            disable
            input-class="text-right"
            outlined
          />
          <money-field
            label="Gross Purchase Cost"
            :value="model.totalCost"
            disable
            outlined
          />

          <money-field
            outlined
            name="realCost"
            label="Nett Purchase Cost"
            v-model="model.realCost"
            v-validate="'required'"
            :error="errors.has('realCost')"
            :error-message="errors.first('realCost')"
            :disable="!formEnabled"
          />
        </div>
        <submit-button
          :is-loading="isLoading"
          @submit="onSubmit"
          class="q-mt-md full-width"
          v-if="formEnabled"
        />
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import Purchase from "src/models/Purchase";
import PurchaseLine from "src/models/PurchaseLine";
import PurchaseLinesList from "./components/PurchaseLinesList";
import SupplierSelect from "./components/SupplierSelect";
import SupplierDialog from "./components/SupplierDialog";
import AccountSelect from "../../finance/GL/components/AccountSelect.vue";
export default {
  name: "Purchase",
  components: {
    PurchaseLinesList,
    SupplierSelect,
    SupplierDialog,
    AccountSelect
  },
  props: {
    value: {
      type: Purchase,
      default: () => new Purchase()
    },
    id: {
      type: [Number, String]
    }
  },
  data() {
    return {
      isLoading: false,
      reloading: false,
      showSuppliers: false,
      model: new Purchase(this.value),
      submitting: false
    };
  },
  watch: {
    "model.totalCost"(val) {
      if (!this.id) {
        this.model.realCost = val;
      }
    },
    id(val) {
      if (Number(val) > 0) {
        this.reloadPurchase();
      }
    }
    // "model.isPaid"(val) {
    //   if (!this.formEnabled) {
    //     this.updateStatus();
    //   }
    // }
  },
  mounted() {
    if (Number(this.id) > 0) {
      this.reloadPurchase();
    }
  },
  computed: {
    formEnabled() {
      return this.model.id < 1;
    }
  },
  methods: {
    async reloadPurchase() {
      try {
        if (this.reloading) return;
        this.reloading = true;
        var res = await this.$api.purchases.getOne(this.id);
        if (res.status < 300) {
          this.model = new Purchase(res.data);
        } else {
          this.$toastr.error("Unable to fetch purchase's records");
          this.$router.back();
        }
      } catch (e) {
        // create new record
        this.model = new Purchase();
        // this.$toastr.error(this.$util.err(e))
      }
      this.reloading = false;
    },
    async updateStatus() {
      if (!this.model.accountCode || this.model.accountCode === null) {
        this.$toastr.error("Credit Account Code is required");
        return;
      }

      if (this.submitting) return;
      this.submitting = true;
      try {
        await this.$api.purchases.updateStatus(
          this.model.id,
          // this.model.isPaid || false,
          this.model.accountCode
        );
        this.$toastr.success("Status berhasil diupdate");
        this.$router.go(-1);
      } catch (error) {
        this.$toastr.error(error);
      }
      this.submitting = false;
    },
    async onSubmit() {
      if (this.isLoading) {
        return;
      }
      if (!this.model.purchaseLines.length) {
        this.$toastr.error("Please add at least one item");
        return;
      }
      await this.$validator.validateAll();
      if (!this.errors.any()) {
        this.isLoading = true;
        var data = this.model;
        data.purchaseLines = data.purchaseLines.map(x =>
          x.id < 1 ? new PurchaseLine({ ...x, id: 0 }) : x
        );
        try {
          const isEditing = data.id > 0;
          var res = await (isEditing
            ? this.$api.purchases.put(data.id, data)
            : this.$api.purchases.post(data));
          if (res.status < 300) {
            this.$toastr.success(
              `${data.id > 0 ? "Record updated" : "Record added"}`
            );
            if (!isEditing) {
              this.$router.replace("/app/rooms/purchases");
            }
          } else {
            this.$toastr.error(res.statusText);
          }
        } catch (e) {
          let emsg = this.$util.err(e);
          this.$toastr.error(emsg);
          this.$store.commit(
            "addErrors",
            this.$util.errModelState(e.response.data.modelState)
          );
        }
        this.isLoading = false;
      }
    }
  }
};
</script>

<style></style>
