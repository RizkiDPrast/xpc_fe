<template>
  <q-dialog v-model="dialogOpen">
    <q-card
      v-if="sales && sales.id && sales.saleLines && sales.saleLines.length"
      style="width:500px;max-width:calc(100vw - 25px)"
    >
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>
          Receipt {{ sales.receiptCode.toUpperCase() }}
        </q-toolbar-title>
        <q-btn flat size="sm" icon="las la-times" v-close-popup />
      </q-toolbar>
      <q-card-section
        class="row no-padding"
        style="padding-left:12px!important;padding-right:12px!important"
      >
        {{ $util.formatDate(sales.createdAt, "DD MMM YY hh:mm") }}
        <q-space />
        {{ sales.createdByName }}
      </q-card-section>
      <hr />
      <q-card-section>
        <q-list>
          <q-item
            class="full-width"
            v-for="item in sales.saleLines"
            :key="item.id"
          >
            <!-- <q-item-section side>

          </q-item-section> -->
            <q-item-section title>
              <q-item-label overline>
                {{ item.itemName }}
              </q-item-label>
              <q-item-label caption>
                {{ item.qty }} * {{ item.unitPrice | money }} /
                {{ getUnitName(item.unitId) }}
                <template v-if="item.hasDiscount">
                  <span v-if="item.percentDiscount" class="text-red">
                    - {{ item.percentDiscount }}%</span
                  >
                  <span v-if="item.moneyDiscount" class="text-red">
                    - {{ item.moneyDiscount | money }}
                  </span>
                </template>
                <q-item-section v-if="item.patient && item.patient.id">
                  {{ getAnimalTypeName(item.patient.animalTypeId) }}
                  {{ item.patient.name }}
                </q-item-section>
                <!-- <q-item-section
                  v-if="
                    item.salesLineRelatedPics &&
                      item.salesLineRelatedPics.length
                  "
                >
                  <q-badge
                    color="grey"
                    class="q-mr-xs q-mb-xs"
                    v-for="pic in item.salesLineRelatedPics"
                    :key="pic.userTypeId"
                  >
                    {{ getUserTypeName(pic.userTypeId) }} {{ pic.user.name }}
                  </q-badge>
                </q-item-section> -->
              </q-item-label>
            </q-item-section>
            <q-item-section side class="text-bold text-right">
              {{ item.rowTotal | money }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <hr />
      <q-card-section v-if="sales.client" class="q-pa-xs q-pl-lg">
        Cust:
        {{ sales.client.code + "-" + sales.client.name }}
      </q-card-section>
      <q-card-section>
        <q-markup-table flat dense>
          <tr>
            <td style="width:40%"></td>
            <th style="width:30%" class="text-right">SubTotal</th>
            <td style="width:30%" class="text-right">
              {{ sales.subTotal | money }}
            </td>
          </tr>
          <tr>
            <td style="width:40%"></td>
            <th style="width:30%" class="text-right">
              <span v-if="sales.percentDiscount > 0">
                {{ sales.percentDiscount }}</span
              >
              % discount
            </th>
            <td style="width:30%" class="text-right">
              {{ sales.discountPercentMoneyValue | money }}
            </td>
          </tr>
          <tr>
            <td style="width:40%"></td>
            <th style="width:30%" class="text-right">discount</th>
            <td style="width:30%" class="text-right">
              {{ sales.moneyDiscount | money }}
            </td>
          </tr>
          <tr>
            <td style="width:40%"></td>
            <th style="width:30%" class="text-right">
              Tax <span v-if="sales.tax > 0"> {{ sales.tax }} % </span>
            </th>
            <td style="width:30%" class="text-right">
              {{ sales.taxMoneyValue | money }}
            </td>
          </tr>
          <tr>
            <td style="width:40%"></td>
            <th style="width:30%" class="text-right">Card surcharge</th>
            <td style="width:30%" class="text-right">
              {{ sales.cardSurcharge | money }}
            </td>
          </tr>
          <tr class="bg-secondary text-white">
            <td style="width:40%"></td>
            <th style="width:30%" class="text-right text-h5 text-bold">
              TOTAL
            </th>
            <td style="width:30%" class="text-right  text-h5 text-bold">
              {{ sales.grandTotal | money }}
            </td>
          </tr>
          <tr>
            <td style="width:40%"></td>
            <th style="width:30%" class="text-right">Cash</th>
            <td style="width:30%" class="text-right">
              {{ sales.cash | money }}
            </td>
          </tr>
          <tr>
            <td style="width:40%"></td>
            <th style="width:30%" class="text-right">Transfer</th>
            <td style="width:30%" class="text-right">
              {{ sales.transfer | money }}
            </td>
          </tr>
          <tr>
            <td style="width:40%"></td>
            <th style="width:30%" class="text-right">
              CC
              <span class="text-bold" v-if="sales.ccEdcType !== 0">
                {{ getEdcTypeName(sales.ccEdcType) }}
              </span>
            </th>
            <td style="width:30%" class="text-right">
              {{ sales.creditCard | money }}
            </td>
          </tr>
          <tr>
            <td style="width:40%"></td>
            <th style="width:30%" class="text-right">
              DC
              <span class="text-bold" v-if="sales.dcEdcType !== 0">
                {{ getEdcTypeName(sales.dcEdcType) }}
              </span>
            </th>
            <td style="width:30%" class="text-right">
              {{ sales.debitCard | money }}
            </td>
          </tr>
          <tr>
            <td style="width:40%"></td>
            <th style="width:30%" class="text-right">Deposit</th>
            <td style="width:30%" class="text-right">
              {{ sales.deposit | money }}
            </td>
          </tr>
          <tr>
            <td style="width:40%"></td>
            <th style="width:30%" class="text-right">Change</th>
            <td style="width:30%" class="text-right">
              {{ sales.change | money }}
            </td>
          </tr>
        </q-markup-table>
      </q-card-section>
      <q-card-section class="text-center">
        {{ sales.note }}
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import Sale from "src/models/Sale";
export default {
  name: "sales-details-dialog",
  props: {
    value: {
      type: Boolean,
      default: () => false
    },
    sales: {
      type: Sale,
      required: true
    }
  },
  data() {
    return {
      animalTypes: []
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
    },
    edcTypes() {
      return this.$store.state.list.edcTypes;
    }
  },
  methods: {
    getEdcTypeName(id) {
      var t = this.edcTypes.find(x => x.id === id);
      if (!t) return "";

      return t.label;
    }
  },
  mounted() {
  }
};
</script>
