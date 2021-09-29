<template>
  <q-card>
    <q-toolbar>
      <q-toolbar-title>
        Data Import
      </q-toolbar-title>
    </q-toolbar>
    <q-card-section style="min-height:200px;">
      <q-file
        accept=".xlsx"
        outlined
        dense
        label="Import Client Datas"
        bottom-slots
        clearable
        v-model="clients"
      >
        <template #hint>
          <div>
            download sample template:
            <a href="/Files/input/customer2.xlsx" download>
              sample_customer
            </a>
          </div>
        </template>
        <template #after>
          <q-btn
            color="primary"
            icon="las la-upload"
            label="Upload"
            @click="uploadClients"
          />
        </template>
      </q-file>
      <q-file
        accept=".xlsx"
        outlined
        dense
        label="Import Product Datas"
        bottom-slots
        clearable
        v-model="products"
        class="q-mt-md"
      >
        <template #hint>
          <div>
            download sample template:
            <a href="/Files/input/product1.xlsx" download>
              sample_product
            </a>
          </div>
        </template>
        <template #after>
          <q-btn
            color="primary"
            icon="las la-upload"
            label="Upload"
            @click="uploadProducts"
          />
        </template>
      </q-file>
    </q-card-section>
    <q-card-section style="margin-left:0;" class="q-pa-md bg-grey-3">
      <q-card flat>
        <q-toolbar>
          <q-toolbar-title class="text-grey">
            Output
          </q-toolbar-title>
          <q-btn
            flat
            icon="las la-times"
            label="Clear Output"
            v-if="output && output !== null"
            @click="output = null"
            color="grey"
          />
        </q-toolbar>
        <q-card-section>
          <pre v-html="output" style="white-space: break-spaces;"></pre>
        </q-card-section>
      </q-card>
    </q-card-section>

    <q-dialog v-model="loading" persistent>
      <q-card style="width:400px;height:300px" class="bg-black">
        <q-card-section class="flex flex-center" style="height:300px;">
          <div>
            <q-spinner-gears size="150px" color="secondary" />
            <p class="text-center text-white no-padding q-mt-md">Please wait</p>
            <p
              class="text-center text-white no-padding"
              v-if="total > 0 && total < 100"
            >
              {{ total }}%
            </p>
            <p class="text-center text-white no-padding q-mt-md">
              <span v-if="total < 99"> Uploading... </span>
              <span v-else> Importing </span>
            </p>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script>
export default {
  name: "ImportDataCard",
  data() {
    return {
      loading: false,
      clients: null,
      products: null,
      total: 0,
      output: null
    };
  },
  methods: {
    async uploadClients() {
      if (!this.clients || this.clients === null) {
        return;
      }
      if (this.loading) return;
      this.output = null;
      this.loading = true;
      try {
        let fd = new FormData();
        fd.append("file", this.clients);
        let config = {
          onUploadProgress: pe =>
            (this.total = !pe.lengthComputable
              ? 0
              : ((pe.loaded / pe.total) * 100).toFixed(1))
        };
        let res = await this.$api.database.importClients(fd, config);
        console.log(res.data);
        let t = JSON.stringify(res.data);
        this.output = `file:${this.clients?.name}\n\r${t}`;
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    },
    async uploadProducts() {
      if (!this.products || this.products === null) {
        return;
      }
      if (this.loading) return;
      this.output = null;
      this.loading = true;
      try {
        let fd = new FormData();
        fd.append("file", this.products);
        let config = {
          onUploadProgress: pe =>
            (this.total = !pe.lengthComputable
              ? 0
              : ((pe.loaded / pe.total) * 100).toFixed(1))
        };
        let res = await this.$api.database.importProducts(fd, config);
        console.log(res.data);
        let t = JSON.stringify(res.data);
        this.output = `file:${this.products?.name}\n\r${t}`;
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    }
  }
};
</script>
