<script setup lang="ts">
</script>

<template>
  <header>
    <nav class="flex flex-row gap-2 m-auto justify-center">
      <router-link class="btn btn-sm" to="/">New Image</router-link>
      <router-link class="btn btn-sm" to="/learn">Practice</router-link>
    </nav>
  </header>
  <main class="m-auto p-4 flex flex-col max-w-2xl">
    <RouterView />
  </main>

</template>

<style scoped></style>
