<script setup>
const props = defineProps({
  title: String,
});
const text = defineModel();
const status = computed(() => {
  if (text.value && text.value.length > 0) {
    return "open";
  } else {
    return "close";
  }
});
</script>
<template>
  <div class="group">
    <textarea class="input" v-model="text" :class="status"></textarea>
    <p class="title">{{ title }}</p>
  </div>
</template>
<style lang="scss" scoped>
@use "../../styles/themes.scss" as *;

.group {
  position: relative;
  .title {
    position: absolute;
    top: 5px;
    left: 5px;
    margin: 0;
    font-size: 1.3em;
    opacity: 0.5;
  }
  .input {
    position: relative;
    border: none;
    outline: none;
    font-size: 1.3em;
    width: 100%;
    height: 100%;
    resize: none;
    // scrollbar-width: ;
    padding: 0 10px;
    @include useTheme {
      background-color: getTheme(background-color);
    }
    &:focus,
    &:active,
    &.open {
      & + .title {
        top: calc(100% - 1.3em - 5px);
        opacity: 0.3;
      }
    }
  }
}
</style>
