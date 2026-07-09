<script lang="ts" setup>
const props = defineProps<{
  scale: number;
}>();
// const boxStyle = reactive({
//     height:
// })
</script>
<template>
  <div class="container" :style="{ '--ele-height': scale }">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: calc(var(--ele-height) * 100%);
  .content {
    position: sticky;
    width: 100%;
    // top: calc(5em + 20px);
    top: 0;
  }
}
</style>
