<script setup>
const props = defineProps({
  width: {
    type: Number,
    default: 400,
  },
  height: {
    type: Number,
    default: 300,
  },
  title: {
    type: String,
    default: "窗口标题",
  },
});
const window = ref();
const open = () => {
  window.value.showModal();
}
const close = () => {
  window.value.close();
}
defineExpose({ open, close });
</script>
<template>
  <dialog
    class="window"
    :style="{
      // top: `calc(50% - ${height / 2}px)`,
      // left: `calc(50% - ${width / 2}px)`,
      height: `${height}px`,
      width: `${width}px`,
    }"
    ref="window"
  >
    <div class="windowTitle">
      <p>{{ title }}</p>
      <click-button class="close" @click="close">✕</click-button>
    </div>
    <div class="windowContent">
      <slot></slot>
    </div>
  </dialog>
</template>
<style scoped lang="scss">
@use "../../styles/themes.scss" as *;
.window {
  position: fixed;
  @include useTheme {
    background-color: getTheme(background-color);
    border: 2px solid getTheme(border-color);
  }
  // backdrop-filter: blur(0);
  .windowTitle {
    height: 40px;
    padding: 5px;
    overflow: hidden;
    display: flex;
    align-items: center;
    p {
      font-weight: bold;
      font-size: 20px;
      margin: 0;
      @include useTheme {
        color: getTheme(text-color);
      }
    }
    .close {
      margin-left: auto;
    }
  }
  .windowContent {
    height: calc(100% - 70px);
    padding: 10px;
    overflow: hidden auto;
  }
}
</style>
