<script setup>
defineProps({
  path: {
    type: String,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
});
</script>
<template></template>
<style lang="scss" scoped>
.content-enter-active,
.content-leave-active,
.content-move {
  transition: all 0.25s ease-in-out;
}
.content-enter-from {
  opacity: 0;
  transform: translate(20px, 20px);
}
.content-leave-to {
  opacity: 0;
  transform: translate(-20px, -20px);
}
.content-leave-active {
  position: absolute;
}
</style>
