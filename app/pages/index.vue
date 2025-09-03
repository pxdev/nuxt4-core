<script setup>

const { data: pages } = useFetch('/api/pages', {
  method: 'GET',
})

</script>

<template>
  <main class="h-full">
    {{ pages }}
   </main>
</template>

<style scoped></style>
