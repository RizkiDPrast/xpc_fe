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
              :class="menu.class"
              v-else
            >
              <q-item-section avatar top>
                <q-icon
                  :size="miniModel ? 'sm' : 'md'"
                  :name="menu.icon"
                  class="q-mt-xs"
                >
                </q-icon>
                <q-badge
                  v-if="miniModel && menu.badge"
                  :label="menu.badge"
                  color="warning"
                  class="absolute"
                  style="top:4px;right:2px;"
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

              <q-item-section
                side
                v-if="menu.sideTo || menu.badge"
                :top="!!menu.badge"
              >
                <q-btn
                  v-if="menu.sideTo"
                  round
                  :icon="menu.sideIcon"
                  :to="menu.sideTo"
                />
                <q-badge
                  v-if="menu.badge"
                  :label="menu.badge"
                  color="warning"
                />
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
  mounted() {
    setTimeout(() => {
      this.countBoarding();
    }, 3000);
  },
  computed: {
    inPatientCount() {
      return this.$store.state.app.inPatientCount;
    },
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
          to: "/app/rooms/dashboard",
          label: "Dashboard",
          icon: "las la-chart-bar",
          caption: "Analytical overview",
          class: "text-warning",
          filter: this.isFinance || this.isAdmin
        },
        {
          to: "/app/rooms/on-sites",
          label: "Queue",
          icon: "las la-home",
          caption: "Registration and queue system"
        },
        // {
        //   to: "/app/rooms/clients",
        //   label: "Clients",
        //   icon: "las la-user",
        //   caption: "Client, appointments, pets and pet's signalements"
        // },
        {
          to: "/app/rooms/vet/clients",
          label: "Clients",
          icon: "las la-id-card",
          caption: "Managing clients, pets and signalements"
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
          caption: "Managing stocks of all inventory-managed products",
          filter: this.isFinance || this.isAdmin
        },
        { separator: 1 },
        {
          to: "/app/rooms/unpaid-receipts",
          label: "Unpaid Receipts",
          icon: "las la-dizzy",
          caption: "List of all unpaid receipts",
          class: "text-negative"
        },
        {
          to: "/app/rooms/untransferred-items",
          label: "Untransferred Items",
          icon: "las la-people-carry",
          caption:
            "Items that has been used but not yet transferred to receipt for sale"
        },

        {
          to: "/app/rooms/all-client-deposits",
          label: "All client deposits",
          icon: "las la-coins",
          caption: "Remaining deposits from all clients"
        },

        // // following is not used
        // {
        //   to: "/app/rooms/unpaid-items",
        //   label: "Unpaid Items",
        //   icon: "las la-box-open",
        //   caption: "List of items from unpaid receipts",
        //   class: "text-secondary"
        // },
        { separator: 1 },
        // { label: "Veterinarian", filter: this.isVet || this.isAdmin },
        { label: "Veterinarian" },
        // {
        //   to: "/app/rooms/vet/clients",
        //   label: "Clients",
        //   icon: "las la-id-card",
        //   caption: "Managing clients, pets and signalements"
        // },
        {
          to: "/app/rooms/vet/in-patients",
          label: "In-Patients and Pet Boarding",
          icon: "las la-bed",
          caption: "Managing in-patients and pet boarding",
          badge: this.inPatientCount
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
        {
          to: "/app/rooms/finance/salaries",
          label: "Salaries",
          icon: "las la-hand-holding-usd",
          caption: "Managing employee's commissions",
          filter: this.isFinance || this.isAdmin
        },
        {
          to: "/app/rooms/finance/reports",
          label: "Reports",
          icon: "las la-book",
          caption: "Client visits, profit report",
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
        },
        {
          to: "/app/rooms/utilities",
          label: "Utilities",
          icon: "las la-database",
          caption: "Database management",
          filter: this.isAdmin,
          class: "text-secondary"
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
