<template>
  <q-page padding>
    <page-header />
    <q-card>
      <q-toolbar class="text-grey">
        <q-btn flat icon="las la-arrow-left" @click="backToList" />
        <q-toolbar-title class="text-dark">
          {{ "Book Entry" }}
        </q-toolbar-title>

        <submit-button
          v-if="!isUpdating"
          :isLoading="isSubmitting"
          @click="submit"
        />

        <submit-button
          v-if="isUpdating && model.files && model.files.length"
          :isLoading="isSubmitting"
          @click="postFiles"
          label="Upload attachments"
        />
      </q-toolbar>
      <hr class="border-title" />
      <q-card-section class="row ">
        <q-input
          outlined
          dense
          label="Code"
          placeholder="Auto generated if empty"
          class="col-4 q-mb-md"
          v-model="model.code"
          :disable="isUpdating"
        />
        <div class="col-4" />
        <date-input
          label="Transaction date"
          outlined
          dense
          class="col-4 q-mb-md"
          v-model="model.date"
          :disable="isUpdating"
          v-validate="'required'"
          name="date"
          :error-message="errors.first('date')"
          :error="errors.has('date')"
        />
        <q-input
          outlined
          dense
          label="Description"
          class="col-12 q-mb-md"
          v-model="model.description"
          :disable="isUpdating"
          v-validate="'required'"
          name="description"
          :error-message="errors.first('description')"
          :error="errors.has('description')"
        />

        <my-file-input
          multiple
          v-model="model.files"
          label="Attachments"
          outlined
          class="col-12"
          dense
          clearable
          :hint="
            model.files && model.files.length
              ? `${model.files.length} files`
              : ''
          "
        />

        <q-item v-for="item in model.appFiles" :key="item.id">
          <q-item-section>
            <a
              style="text-decoration:none"
              :href="item.fileUri"
              target="_blank"
              :alt="item.description"
            >
              {{ item.fileName }}
            </a>
          </q-item-section>
          <q-item-section side>
            <q-btn
              icon="las la-trash"
              flat
              size="sm"
              color="negative"
              @click="delFile(model.id, item)"
            >
            </q-btn>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-section>
        <q-markup-table flat dense class="q-pt-md" style="">
          <thead>
            <q-th style="width:5px">
              No
            </q-th>
            <q-th class="text-left">
              Code
            </q-th>
            <q-th class="text-left">
              Description
            </q-th>
            <q-th class="text-center">
              Debit
            </q-th>
            <q-th class="text-center">
              Credit
            </q-th>
            <q-th class="text-center">
              Line Total
            </q-th>
            <q-th style="width:50px" class="text-right">
              Delete
            </q-th>
          </thead>
          <tbody>
            <template v-if="isLoading">
              <q-tr>
                <q-td colspan="5" class="text-center">
                  <q-circular-progress indeterminate size="md" />
                </q-td>
              </q-tr>
            </template>
            <template v-else>
              <q-tr v-for="item in dataModel" :key="item.id">
                <q-td>
                  <q-field
                    class="no"
                    outlined
                    readonly
                    dense
                    :label="dataModel.indexOf(item) + 1"
                  />
                </q-td>
                <q-td>
                  <account-select
                    dense
                    outlined
                    autocomplete="off"
                    @blur="dirtyModel = true"
                    @selectedChanged="val => selectedChanged(item.id, val)"
                    v-model="item.accountCode"
                    :name="accountCode(item.id)"
                    class="text-capitalize account"
                    v-validate="'required'"
                    :error="errors.has(accountCode(item.id))"
                    :error-message="errors.first(accountCode(item.id))"
                    :disable="isUpdating"
                  />
                </q-td>
                <q-td>
                  <q-input
                    style="min-width:350px;max-width:400px"
                    dense
                    outlined
                    autocomplete="off"
                    @blur="dirtyModel = true"
                    v-model="item.description"
                    :name="description(item.id)"
                    class="description text-wrap"
                    :ref="description(item.id)"
                    v-validate="'required'"
                    :error="errors.has(description(item.id))"
                    :error-message="errors.first(description(item.id))"
                    :disable="isUpdating"
                  />
                </q-td>
                <q-td class="text-center">
                  <money-field
                    style=""
                    outlined
                    autocomplete="off"
                    @blur="dirtyModel = true"
                    :disabled="item.credit > 0"
                    v-model="item.debit"
                    :name="debit(item.id)"
                    class="debit"
                    v-validate="'required'"
                    :ref="debit(item.id)"
                    :error="errors.has(debit(item.id))"
                    :error-message="errors.first(debit(item.id))"
                    :disable="isUpdating"
                    dense
                  />
                </q-td>
                <q-td class="text-center">
                  <money-field
                    style=""
                    outlined
                    autocomplete="off"
                    @blur="dirtyModel = true"
                    :disabled="item.debit > 0"
                    v-model="item.credit"
                    :name="credit(item.id)"
                    class="credit"
                    v-validate="'required'"
                    :ref="credit(item.id)"
                    :error="errors.has(credit(item.id))"
                    :error-message="errors.first(credit(item.id))"
                    :disable="isUpdating"
                    dense
                  />
                </q-td>
                <q-td>
                  <money-field
                    readonly
                    class="total"
                    :value="item.lineTotal"
                    outlined
                    dense
                  />
                </q-td>
                <q-td class="text-right">
                  <q-btn
                    flat
                    round
                    @click="del(item.id)"
                    icon="las la-trash"
                    color="negative"
                    v-if="item.id < 1"
                  />
                </q-td>
              </q-tr>
              <q-tr>
                <q-td colspan="6" class="text-center">
                  <q-btn
                    flat
                    dense
                    icon="las la-plus"
                    size="sm"
                    label="Add"
                    @click="add"
                    v-if="!isUpdating"
                  />
                </q-td>
              </q-tr>
            </template>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import CashBookEntry from "src/models/CashBookEntry";
import CashBookEntryLine from "src/models/CashBookEntryLine";
import PageHeader from "src/components/PageHeader.vue";
import AccountSelect from "./components/AccountSelect.vue";
import MyFileInput from "src/components/MyFileInput.vue";

export default {
  components: { PageHeader, AccountSelect, MyFileInput },
  name: "CashBookEntryDetails",
  props: {
    id: {
      type: [String, Number],
      default: () => 0
    }
    // cashType: {
    //   type: String,
    //   required: true,
    //   validator: val =>
    //     val &&
    //     val.length &&
    //     ["cashin", "cashout"].indexOf(val.toLowerCase()) > -1
    // }
  },
  data() {
    return {
      model: new CashBookEntry(),
      dataModel: [],
      dirtyModel: false,
      isLoading: false,
      isSubmitting: false,
      filteredUnit: {}
    };
  },
  computed: {
    isUpdating() {
      return this.model.id > 0;
    }
  },
  mounted() {
    if (this.id !== 0 || this.id !== "0") {
      this.onRequest();
    }
  },
  methods: {
    async onRequest() {
      try {
        if (!Number(this.id) > 0) return;
        const res = await this.$api.gl.bookEntries.getOne(this.id);
        this.model = new CashBookEntry(res.data);
        this.dataModel = this.model.cashBookEntryLines;
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
    },
    async submit() {
      const isValid = await this.$validator.validateAll();
      if (!isValid) {
        this.$toastr.warning("Please correct the form");
        return;
      }

      this.model.cashBookEntryLines = this.dataModel;

      if (
        !this.model.cashBookEntryLines ||
        !this.model.cashBookEntryLines.length
      ) {
        this.$toastr.warning("Please add items");
        return;
      }

      var balance = this.model.cashBookEntryLines.reduce(
        (a, b) => a + b.debit - b.credit,
        0
      );
      if (balance !== 0) {
        this.$toastr.warning("Total credit and debit should be equal");
        return;
      }

      if (this.isSubmitting) {
        return;
      }
      this.isSubmitting = true;

      this.model.cashBookEntryLines = this.dataModel.map(
        x => new CashBookEntryLine(x)
      );
      try {
        if (this.isUpdating) {
          this.$toastr.error("Updating was failed");
          // await this.$api.cashBookEntries.put(this.data)
        } else {
          var data = JSON.parse(JSON.stringify(this.model));
          var form = new FormData();
          form.append("date", data.date);
          if (data.code) {
            form.append("code", data.code);
          }
          form.append("description", data.description);

          data.cashBookEntryLines.forEach((item, ix) => {
            form.append(
              `CashBookEntryLines[${ix}].accountCode`,
              item.accountCode
            );
            form.append(
              `CashBookEntryLines[${ix}].description`,
              item.description
            );
            form.append(`CashBookEntryLines[${ix}].debit`, item.debit);
            form.append(`CashBookEntryLines[${ix}].credit`, item.credit);
          });

          if (data.files && data.files.length) {
            this.model.files.forEach((item, ix) => {
              form.append(`Files`, item);
            });
            // form.append(`Files`, this.model.files);
          }

          await this.$api.gl.bookEntries.post(form);
          this.$toastr.success("New entry was posted");
          this.backToList();
        }
      } catch (e) {
        this.$toastr.error(this.$util.err(e));
      }
      this.isSubmitting = false;
    },
    async add() {
      const isValid = await this.$validator.validateAll();
      if (!isValid) {
        this.$toastr.warning("Please correct all error then resubmit");
        return;
      }
      const id = this.dataModel.length === 0 ? 0 : this.dataModel.length * -1;
      this.dataModel.push(new CashBookEntryLine({ id }));
      console.log(this.dataModel);
    },
    del(id) {
      this.dataModel = this.dataModel.filter(x => x.id !== id);
    },
    async delFile(id, item) {
      if (
        await this.confirm(`Are you sure want to delete file ${item.fileName}?`)
      ) {
        try {
          await this.$api.gl.bookEntries.deleteFile(id, item.id);
          this.$toastr.success("File was deleted");
          this.model.appFiles = this.model.appFiles.filter(
            x => x.id !== item.id
          );
        } catch (e) {
          this.$toastr.error(e);
        }
      }
    },
    async postFiles() {
      if (!this.model.files || !this.model.files.length) {
        this.$toastr.warning("Please add files");
        return;
      }

      let form = new FormData();
      this.model.files.forEach((item, ix) => {
        form.append(`Files`, item);
      });

      try {
        await this.$api.gl.bookEntries.postFiles(this.model.id, form);
        this.$toastr.success("File was uploaded");
        this.onRequest();
      } catch (e) {
        this.$toastr.error(e);
      }
    },
    selectedChanged(id, val) {
      this.dataModel = this.dataModel.map(x => {
        if (x.id === id) {
          x.description = val.name;
          x.total = 0;
          x.unitPrice = val.sellingPrice;
          x.unitId = val.baseUnitId;
          x.productUnitConverters = val.productUnitConverters;

          if (x.productUnitConverters && x.productUnitConverters.length) {
            const prices = x.productUnitConverters.map(x => ({
              id: x.toUnitId,
              price: x.baseUnitMultiplier * val.sellingPrice
            }));
            prices.push({ id: x.unitId, price: x.unitPrice });
            this.filteredUnit[id] = prices;
          } else {
            this.filteredUnit[id] = [{ id: x.unitId, price: x.unitPrice }];
          }
        }
        return x;
      });
      const el = this.$refs[this.description(id)][0].$el;
      el.focus();
    },
    backToList() {
      this.$router.replace("/app/rooms/finance/book-entry");
    },
    accountCode(id) {
      return "accountCode-" + id;
    },
    description(id) {
      return "description-" + id;
    },
    credit(id) {
      return "credit-" + id;
    },
    debit(id) {
      return "debit-" + id;
    },
    total(id) {
      return "total-" + id;
    }
  }
};
</script>

<style lang="sass" scoped>
.account
  min-width: 5em

.no, .account,.description,.total, .credit, .debit
    padding-bottom: .8em

.q-field__bottom--animated
  transform: translateY(70%)!important
  left: -12px

.q-td
  padding-left: 0!important
  padding-right: 0!important
</style>
