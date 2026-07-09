<script lang="ts" setup>
const outerContainer = useTemplateRef("outerContainer");
const innerContainer = useTemplateRef("innerContainer");
const topHeight = ref(0);
const bottomHeight = ref(0);
const outHeight = ref(0);
onMounted(() => {
  if (innerContainer.value) {
    for (let i = 0; i < innerContainer.value.children.length; i++) {
      const child = innerContainer.value.children[i] as HTMLElement;
      if (child) {
        outHeight.value += child.getBoundingClientRect().height;
        console.log(child.getBoundingClientRect().height);
      }
    }
  }
  if (outerContainer.value) {
    topHeight.value = outerContainer.value.getBoundingClientRect().top;
    bottomHeight.value = outerContainer.value.getBoundingClientRect().bottom;
  }
});
</script>
<template>
  <div
    class="heightContainer"
    :style="{
      '--ele-height': outHeight,
      '--top-height': topHeight,
      '--bottom-height': bottomHeight,
    }"
    ref="outerContainer"
  >
    <div class="widthContainer" ref="innerContainer">
      <slot></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.heightContainer {
  // height-container
  width: 100%;
  height: calc(var(--ele-height) * 1px);
  // overflow-x: hidden;
  .widthContainer {
    position: sticky;
    top: 5em;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    // transform: translateX(
    //   max(0, calc((var(--scroll) - var(--top-height)) / var(--ele-height) * -100%))
    // );
    transform: translateX(
      min(
        0%,
        max(
          calc(
            ((var(--scroll) - var(--top-height)) / (var(--ele-height) - var(--viewport-height))) *
              -100%
          ),
          -100%
        )
      )
    );
  }
}
</style>
