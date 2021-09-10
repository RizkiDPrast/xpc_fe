<template>
  <q-drawer
    side="left"
    :value="true"
    :mini="miniModel"
    bordered
    :breakpoint="500"
    content-class="text-white"
    behavior="desktop"
    class="bg-primary br-white"
  >
    <q-scroll-area style="height:calc(100% - 50px);" class="text-black">
      <q-list>
        <q-item> </q-item>
        <div v-for="menu in menus" :key="menu.name">
          <template v-if="typeof menu.filter === 'undefined' || menu.filter">
            <q-separator v-if="menu.separator" spaced />
            <q-item-label overline v-else-if="!menu.to" class="q-pl-lg">
              {{ menu.label }}
            </q-item-label>
            <q-item
              v-ripple
              :clickable="$route.path === menu.to ? false : true"
              active-class="bg-white text-primary menu-active"
              :to="menu.to"
              v-else
            >
              <q-item-section avatar top>
                <q-icon
                  :size="miniModel ? 'sm' : 'md'"
                  :name="menu.icon"
                  class="q-mt-xs"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">
                  {{ menu.label }}
                </q-item-label>
                <q-item-label lines="2" v-if="menu.caption" caption>
                  {{ menu.caption }}
                </q-item-label>
              </q-item-section>

              <q-item-section side v-if="menu.sideTo">
                <q-btn round :icon="menu.sideIcon" :to="menu.sideTo" />
              </q-item-section>
            </q-item>
          </template>
        </div>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
export default {
  props: {
    mini: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    miniModel: {
      get() {
        return this.mini;
      },
      set(val) {
        this.$emit("update:mini", val);
      }
    },
    menus() {
      var arr = [
        {
          to: "/app/rooms/on-sites",
          label: "Queue",
          icon: "las la-home",
          caption: "Registration and queue system"
        },
        {
          to: "/app/rooms/clients",
          label: "Clients",
          icon: "las la-user",
          caption: "Client, appointments, pets and pet's signalements"
        },
        {
          to: "/app/rooms/patients",
          label: "Patients",
          icon: "las la-horse",
          caption: "Search for client based on patients"
        },
        {
          to: "/app/rooms/sales",
          label: "Sales",
          icon: "las la-cash-register",
          caption: "Point of sales system"
        },
        {
          to: "/app/rooms/purchases",
          label: "Purchases",
          icon: "las la-shopping-cart",
          caption: "Company purchases"
        },
        {
          to: "/app/rooms/stock-opname",
          label: "Stock Opname",
          icon: "las la-clipboard-check",
          caption: "Managing stocks of all inventory-managed products"
        },
        { separator: 1 },
        // { label: "Veterinarian", filter: this.isVet || this.isAdmin },
        { label: "Veterinarian" },
        {
          to: "/app/rooms/vet/clients",
          label: "Clients",
          icon: "las la-id-card",
          caption: "Managing clients, pets and signalements"
        },
        { separator: 1 },
        { label: "Human resource" },
        {
          to: "/app/rooms/form-cuti",
          label: "Cuti staff",
          icon: "las la-snowboarding",
          caption: ""
        },
        { separator: 1 },
        { label: "Finance", filter: this.isFinance || this.isAdmin },
        {
          to: "/app/rooms/products",
          label: "Product",
          icon: "las la-tags",
          caption: "Managing Goods & Services",
          filter: this.isFinance || this.isAdmin
        },
        {
          to: "/app/rooms/finance/commissions",
          label: "Commissions",
          icon: "las la-file-contract",
          caption: "Managing employee's commissions",
          filter: this.isFinance || this.isAdmin
        },
        { separator: 1, filter: this.isAdmin },
        { label: "Admin", filter: this.isAdmin },
        {
          to: "/app/rooms/users",
          label: "Users",
          icon: "las la-user-tie",
          caption: "Managing app user",
          filter: this.isAdmin
        }
      ];

      return arr;
    }
  }
};
</script>

<style lang="scss" scoped>
.br-white,
.br-white::v-deep .q-drawer {
  border-right: 1px solid white;
}
.menu-active,
.menu-active::v-deep .q-drawer {
  border-right: 3px solid var(--q-color-primary);
  // border-top-right-radius: 6px;
  // border-bottom-right-radius: 6px;
}
</style>
