<script setup>
const props = defineProps({
  text: String,
});
</script>
<template>
  <button class="but">
    <slot></slot>
  </button>
</template>
<style lang="scss" scoped>
@use "../styles/themes.scss" as *;
.but {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10%;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.5s;
  @include useTheme {
    color: getTheme(text-color);
    border: 2px solid getTheme(border-color);
    background-color: getTheme(background-color);
    &:hover {
      background-color: getTheme(hover-color);
    }
  }
}
</style>
