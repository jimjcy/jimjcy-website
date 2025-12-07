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
const isOpen = ref(false);
const window = ref();
const open = () => {
  isOpen.value = true;
  nextTick(() => {
    window.value.showModal();
  });
};
const close = () => {
  window.value.close();
};
defineExpose({ open, close });
</script>
<template>
  <Transition name="dialog" @on-after-leave="close">
    <dialog
      class="window"
      :style="{
        // top: `calc(50% - ${height / 2}px)`,
        // left: `calc(50% - ${width / 2}px)`,
        height: `${height}px`,
        width: `${width}px`,
      }"
      ref="window"
      v-if="isOpen"
    >
      <div class="window-title">
        <p>{{ title }}</p>
        <click-button class="close" @click="isOpen = false">✕</click-button>
      </div>
      <div class="window-content">
        <slot></slot>
      </div>
    </dialog>
  </transition>
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
  .window-title {
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
  .window-content {
    height: calc(100% - 70px);
    padding: 10px;
    overflow: hidden auto;
  }
}
.dialog-enter-from {
  opacity: 0;
  transform: translateY(-5em);
}
.dialog-enter-active {
  transition: all .4s ease-in;
}
.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.dialog-leave-active {
  transition: all .3s ease-out;
}
.dialog-leave-to {
  opacity: 0;
  transform: translateY(3em);
}
</style>
