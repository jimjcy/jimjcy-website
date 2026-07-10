<script lang="ts" setup>
import stickyContent from "./common/component/stickyContent.vue";
// import flatScroll from "./common/component/flatScroll.vue";

function getViewportSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}
const introPartNumber = 3;
const viewportSize = ref<{
  width: number;
  height: number;
}>(getViewportSize());
const introListScrollTop = ref<number>(0);
const introListScroll = useTemplateRef("introListScroll");

function onWindowResize() {
  viewportSize.value = getViewportSize();
  introListScrollTop.value = introListScroll.value?.scrollTop || 0;
}

window.addEventListener("resize", onWindowResize);
onMounted(() => {
  onWindowResize();
});
onUnmounted(() => {
  window.removeEventListener("resize", onWindowResize);
});
</script>
<template>
  <div
    class="content"
    :style="{
      '--viewport-height': viewportSize.height,
      '--viewport-width': viewportSize.width,
      '--intro-list-scroll-top': introListScrollTop,
    }"
  >
    <div class="center">
      <div class="welcome">
        <div class="word" style="--dir: 1; --index: 0">欢</div>
        <div class="word" style="--dir: -1; --index: 1">迎</div>
        <div class="word" style="--dir: 1; --index: 2">来</div>
        <div class="word" style="--dir: -1; --index: 3">到</div>
      </div>
      <div class="website" style="--dir: 1; --index: 4">小井井的网站</div>
      <div class="mascot" style="--dir: 1; --index: 5">
        吉祥物（？：<img class="img" src="../../assets/mascot.jpg" />
      </div>
      <div class="continue" style="--dir: 1; --index: 6">向下滚动了解更多</div>
      <!-- <div class="arrow">↓</div>
      <div class="arrow">↓</div> -->
    </div>
  </div>
  <div
    class="intro-list-scroll"
    :style="{
      '--intro-part-number': introPartNumber,
    }"
    ref="introListScroll"
  >
    <div class="intro-list-area">
      <div class="intro-list">
        <div class="intro" style="background-color: red"></div>
        <div class="intro" style="background-color: yellow"></div>
        <div class="intro" style="background-color: blue"></div>
      </div>
    </div>
  </div>
  <div class="footer">
    <p>Copyright © 2024 - 2026 小井井的网站 jimjcy.top All Rights Reserved.</p>
    <a href="https://beian.miit.gov.cn/" target="_blank">赣ICP备2024027845号-1</a>
    <a
      href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=36070202001004"
      target="_blank"
      >赣公网安备 36070202001004号</a
    >
    <div class="intro-list-area">
      <div class="intro-list">
        <div class="intro" style="background-color: red"></div>
        <div class="intro" style="background-color: yellow"></div>
        <div class="intro" style="background-color: blue"></div>
      </div>
    </div>
    <div class="footer">
      <p>Copyright © 2024 - 2026 小井井的网站 jimjcy.top All Rights Reserved.</p>
      <a href="https://beian.miit.gov.cn/" target="_blank">赣ICP备2024027845号-1</a>
      <a
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=36070202001004"
        target="_blank"
        >赣公网安备 36070202001004号</a
      >
      <p>Powered by Vue+Vite+VueRouter Designed by jimjcy</p>
      <p>
        友情链接：<a target="_blank" href="https://kuankuan.site">宽宽的小天地</a>
        <a target="_blank" href="https://python666.cn">crossin的个人博客</a>
        <a target="_blank" href="http://bsynet.cc">思远的网站</a>
        <a target="_blank" href="http://hezi.xyxpz.cn">鹤子的网站</a>
        <a target="_blank" href="https://neongel.github.io">小皮鸭(neongel工作室)的网站</a>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../styles/themes.scss" as *;

$headerHeight: 5em;

$headerHeight: 5em;

// .stickybox {
//   width: 100%;
// }

.intro-list-scroll {
  height: calc(var(--viewport-height) * var(--intro-part-number) * 1px); // $headerHeight
  width: 100%;
  .intro-list-area {
    height: calc(var(--viewport-height) * 1px);
    position: relative;
    background-color: red;
    position: sticky;
    top: 0;
    height: 100%;
    .intro-list {
      display: flex;
      flex-direction: row;
      height: 100%;
      .intro {
        width: var(--viewport-width);
        height: 100%;
      }
    }
  }
}

.content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .center {
    display: flex;
    align-items: center;
    flex-direction: column;
    .welcome {
      display: flex;
      flex-direction: row;
      .word {
        display: block;
        font-size: 2em;
        @include useTheme {
          color: getTheme(text-color);
        }
        animation: 0.4s in calc(var(--index) * 0.3s) forwards;
        opacity: 0;
        // filter: drop-shadow(2px 2px);
        // TODO: shadow
      }
    }
    .website {
      font-size: 5em;
      text-align: center;
      @include useTheme {
        color: getTheme(text-color);
      }
      animation: 0.7s in calc(var(--index) * 0.3s) forwards;
      opacity: 0;
    }
    .mascot {
      display: flex;
      align-items: center;
      font-size: 3em;
      @include useTheme {
        color: getTheme(text-color);
      }
      animation: 0.7s in calc(var(--index) * 0.35s) forwards;
      opacity: 0;
      text-align: center;
      .img {
        width: 1.5em;
        height: 1.5em;
        border-radius: 0.3em;
      }
    }
    .continue {
      font-size: 1.5em;
      margin-top: 20px;
      animation: 0.7s in calc(var(--index) * 0.35s) forwards;
      opacity: 0;
      @include useTheme {
        color: getTheme(text-color);
      }
    }
  }
}
@keyframes in {
  0% {
    transform: translateY(calc(var(--dir) * 100%));
    // transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
.footer {
  margin-top: 50px;
  height: 100px;
}
.title {
  width: 100%;
  height: 100%;
}
.block {
  text-align: center;
  // p {
  //   font-size: 1vw;
  // }
}
</style>
