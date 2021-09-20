<template>
  <div class="q-pa-md">
    <page-header v-if="$route.path === '/app/rooms'" />
    <div
      v-if="$route.path === '/app/rooms'"
      class=" flex flex-center text-subtitle1"
      style="height:500px;max-height:calc(100vh - 250px)"
    >
      Please select menu on the left
    </div>
    <router-view> </router-view>
  </div>
</template>

<script>
</script>