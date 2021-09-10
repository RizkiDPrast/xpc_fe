<template>
  <q-footer>
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
