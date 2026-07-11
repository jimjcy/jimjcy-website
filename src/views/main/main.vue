<script lang="ts" setup>
const pageEle = useTemplateRef('pageEle');
const introPartNumber = 3;

const introListScrollTop = ref<number>(0);
const introListScroll = useTemplateRef('introListScroll');
const scrollTop = ref<number>(0);
const introListOffsetTop = ref<number>(0);

const viewportSize = ref<{
  width: number;
  height: number;
}>({ width: 0, height: 0 });

function getViewportSize() {
  return {
    width: pageEle.value?.clientWidth || 0,
    height: pageEle.value?.clientHeight || 0,
  };
}
function onWindowResize() {
  viewportSize.value = getViewportSize();
  introListScrollTop.value = introListScroll.value?.scrollTop || 0;
  introListOffsetTop.value = introListScroll.value?.offsetTop || 0;
  scrollTop.value = pageEle.value?.scrollTop || 0;
}
function onScroll() {
  scrollTop.value = pageEle.value?.scrollTop || 0;
}

interface introType {
  title: string;
  subheading: string;
  content: Array<string>;
}
export const introData: Array<introType> = reactive([
  {
    title: '基本信息',
    subheading: 'Basic Information',
    content: [''],
  },
]);

onMounted(() => {
  pageEle.value!.addEventListener('scroll', onScroll);
  pageEle.value!.addEventListener('resize', onWindowResize);
  onWindowResize();
  onScroll();
});
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onWindowResize);
});
</script>
<template>
  <div
    class="page"
    ref="pageEle"
    :style="{
      '--viewport-height': viewportSize.height,
      '--viewport-width': viewportSize.width,
      '--scroll-top': scrollTop,
    }"
  >
    <div class="content">
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
        '--self-scroll': Math.max(
          0,
          Math.min(introPartNumber - 1, (scrollTop - introListOffsetTop) / viewportSize.height),
        ),
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
@use '../../styles/themes.scss' as *;

$headerHeight: 5em;

// .stickybox {
//   width: 100%;
// }

.page {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}

.intro-list-scroll {
  $partHeight: calc(var(--viewport-height) * 1px);
  height: calc($partHeight * var(--intro-part-number));
  width: 100%;

  .intro-list-area {
    position: sticky;
    height: $partHeight;
    width: 100%;
    top: 0;

    .intro-list {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      transform: translate(calc(-1 * var(--self-scroll) * 100%), 0);
      .intro {
        flex: 0 0 auto;
        height: 100%;
        width: 100%;
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
