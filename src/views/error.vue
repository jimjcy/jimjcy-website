<script setup>
const route = useRoute();
const currentPath = route.path;
</script>
<template>
  <h1>404</h1>
  <p>not found {{ currentPath }}</p>
</template>