<script lang="ts" setup>
const outerContainer = useTemplateRef("outerContainer");
const innerContainer = useTemplateRef("innerContainer");
const inHeight = ref(0);
const outHeight = ref(0);
const updateEle = () => {
  inHeight.value = 0;
  outHeight.value = 0;
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
    inHeight.value = outerContainer.value.getBoundingClientRect().top + window.scrollY;
  }
};
window.addEventListener("resize", updateEle);
onMounted(updateEle);
</script>
<template>
  <div
    class="height-container"
    :style="{
      '--ele-height': outHeight,
      '--in-height': inHeight,
    }"
    ref="outerContainer"
  >
    <div class="width-container" ref="innerContainer">
      <slot></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.height-container {
  // height-container
  // width: 100%;
  // height: calc(var(--ele-height) * 1px);
  height: 100%;
  // overflow-x: hidden;
  .width-container {
    position: sticky;
    top: 5em;
    // width: 100%;
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
            ((var(--scroll) - var(--in-height)) / (var(--ele-height) - var(--viewport-height))) *
              -100%
          ),
          -100%
        )
      )
    );
  }
}
</style>
