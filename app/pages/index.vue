<script setup>


const { data: pages } = useFetch('/api/pages', {
  method: 'GET',
})

</script>

<template>
  <main class="h-full">
    <layout-header/>
    <main-banner />
   <debug>{{ pages }}</debug>
  </main>
</template>

<style scoped></style>
