<script setup>
defineProps({
  title: String,
  type: {
    type: String,
    default: "text",
  },
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
    <input
      class="input"
      v-model="text"
      :class="status"
      :type="type"
    />
    <p class="title">{{ title }}</p>
    <div class="decoration"></div>
  </div>
</template>
<style lang="scss" scoped>
@use "../../styles/themes.scss" as *;

.group {
  position: relative;
  .title {
    position: absolute;
    top: calc((100% - 1.3em) / 2);
    left: 0;
    margin: 0;
    font-size: 1.3em;
    opacity: .5;
    user-select: none;
  }
  .input {
    position: relative;
    border: none;
    outline: none;
    font-size: 1.3em;
    width: 100%;
    @include useTheme {
      background-color: getTheme(background-color);
    }
    &:focus,
    &:active {
      & + * + .decoration {
        // opacity: 1;
        width: 100%;
      }
    }
    &:focus,
    &:active,
    &.open {
      & + .title {
        transform: translate(-50%, -130%);
        opacity: 1;
      }
    }
  }
  .decoration {
    position: absolute;
    left: 50%;
    bottom: 0;
    height: 2px;
    // opacity: 0;
    width: 0%;
    transform: translateX(-50%);
    transition: all ease-in-out .5s;
    @include useTheme {
      background-color: getTheme(hover-color);
    }
  }
}
.open {
  width: 100%;
}
.close {
  width: 0%;
}
</style>
