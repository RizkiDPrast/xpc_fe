<template>
  <q-footer>
    <q-fab
      v-if="isAdmin"
      label="Quick links"
      label-position="top"
      external-label
      color="purple"
      icon="las la-bookmark"
      direction="left"
      persistent
      class="my-fab"
    >
      <q-fab-action
        external-label
        label-position="top"
        color="secondary"
        icon="las la-book"
        label="Reports"
        to="/app/rooms/finance/reports"
      />

      <q-fab-action
        external-label
        label-position="top"
        color="orange"
        icon="las la-cash-register"
        label="Sales"
        to="/app/rooms/sales"
      />

      <q-fab-action
        external-label
        label-position="top"
        color="primary"
        icon="las la-shopping-cart"
        label="Purchases"
        to="/app/rooms/purchases"
      />

      <q-fab-action
        external-label
        label-position="top"
        color="primary"
        icon="las la-hand-holding-usd"
        label="Salaries"
        to="/app/rooms/finance/salaries"
      />

      <q-fab-action
        external-label
        label-position="top"
        color="red"
        icon="las la-book"
        label="Other"
        to="/app/rooms/finance/book-entry"
      />
    </q-fab>
    <q-toolbar class="bg-white text-grey-6 q-px-md q-py-md">
      <q-toolbar-title>
        <slot>
          <q-item>
            <q-item-section avatar>
              <q-img
                src="/icons/xpc_favicon.png"
                style="height:50px;width:50px;"
              />
            </q-item-section>
            <q-item-section title>
              <div class="text-h6">Xing Pet Care and Clinic</div>
              <div class="text-caption">
                Jl. Tole Iskandar No.33, Tirtajaya, Kec. Sukmajaya, Kota Depok,
                Jawa Barat 16412
              </div>
            </q-item-section>
            <q-item-section> </q-item-section>
          </q-item>
        </slot>
      </q-toolbar-title>
    </q-toolbar>
  </q-footer>
</template>

<script>
export default {
  name: "XpcFooter",
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.my-fab {
  position: fixed;
  bottom: 12px;
  left: 91vw;
}
</style>
