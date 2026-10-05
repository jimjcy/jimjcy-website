<script lang="ts" setup>
// import * as types from './types';
// const info: Record<string, types.Contact> = {
//   QQ: {
//     name: '771732203',
//     url: 'https://qm.qq.com/cgi-bin/qm/qr?k=vqy3IdrB90OaKlwk8BLE8JGass3Ji0Nn',
//   },
//   微信: { name: 'jimjcy' },
//   bilibili: {
//     name: '小井井jimjcy',
//     url: 'https://space.bilibili.com/519179845',
//   },
//   抖音: { name: '小井井' },
//   Github: { name: 'jimjcy', url: 'https://github.com/jimjcy' },
//   Email: { name: '771732203@qq.com', url: 'mailto: 771732203@qq.com' },
// };
const pageEle = useTemplateRef('pageEle');

const cardNumber = 3;
const viewportSize = ref<{
  width: number;
  height: number;
}>({ width: 0, height: 0 });
const scrollTop = ref<number>(0);

const currentCard = computed(() => {
  return scrollTop.value / viewportSize.value.height + 1;
});

function getViewportSize() {
  return {
    width: pageEle.value?.clientWidth || 0,
    height: pageEle.value?.clientHeight || 0,
  };
}

function onScroll() {
  scrollTop.value = pageEle.value?.scrollTop || 0;
}

function onResize() {
  viewportSize.value = getViewportSize();
  scrollTop.value = pageEle.value?.scrollTop || 0;
}

const resizeObserver = new ResizeObserver(onResize);

onMounted(() => {
  onResize();
  onScroll();
  pageEle.value?.addEventListener('scroll', onScroll);
  resizeObserver.observe(pageEle.value!);
});
// TODO: more beautiful card like k-card-shower
</script>
<template>
  <!-- <div class="page scroll-area" ref="pageEle">
    <div
      class="scroll-info"
      :style="{
        '--card-number': cardNumber,
        '--viewport-height': viewportSize.height,
        '--viewport-width': viewportSize.width,
      }"
    >
      <div class="show-page">
        <div class="page-item">
          <div class="inner-card">
            <div class="card-content"></div>
          </div>
        </div>
      </div>
    </div>
  </div> -->
  <div
    class="page scroll-area"
    :style="{
      '--current-card': currentCard,
    }"
    ref="pageEle"
  >
    <div
      class="card-box"
      :style="{
        '--card-number': 1,
      }"
    >
      <div class="card-content"></div>
    </div>
    <div
      class="card-box"
      :style="{
        '--card-number': 2,
      }"
    >
      <div class="card-content"></div>
    </div>
    <div
      class="card-box"
      :style="{
        '--card-number': 3,
      }"
    >
      <div class="card-content"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '@/styles/themes.scss' as *;

.scroll-area {
  scroll-snap-type: both mandatory;
  & > * {
    scroll-snap-align: center;
  }
}

.card-box {
  height: 100%;
  width: 100%;
  position: relative;
  .card-content {
    width: 80%;
    height: 60%;
    position: relative;
    opacity: clamp(
      0,
      min(var(--current-card), var(--card-number)) - max(var(--current-card), var(--card-number)) +
        1,
      1
    );
    transition: all 0.2s;
    transform: translate(-50%, -50%)
      rotate(calc(-30deg * clamp(-1, var(--current-card) - var(--card-number), 1)));
    transform-origin: top left;
    left: 50%;
    top: calc(50% + 5em / 2);
    border-radius: 1em;
    @include useTheme {
      background-color: getTheme(background-color);
      border: 2px solid getTheme(border-color);
    }
  }
}
// .scroll-info {
//   width: 100%;
//   height: calc(var(--viewport-height) * 1px * var(--card-number));
// }

// .show-page {
//   width: 100%;
//   height: 100%;
//   .page-item {
//     width: 100%;
//     height: 100%;
//     box-sizing: border-box;
//     // padding-top: 5em;
//     display: flex;
//     justify-content: center;
//     .inner-card {
//       width: 80%;
//       height: 80%;
//       @include useTheme {
//         background-color: getTheme(background-color);
//         // border: 2px solid getTheme(border-color);
//       }
//       // .card-content {
//       //   width: 100%;
//       //   height: 100%;
//       // }
//     }
//   }
// }

// .title {
//   text-align: center;
// }

// .block {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   height: 75px;

//   @include useTheme {
//     background-color: getTheme(background-color);
//   }

//   .method {
//     width: 50%;
//     text-align: right;
//     margin: 0;
//     box-sizing: border-box;
//     padding: 10px;
//   }

//   .content {
//     flex: 1;
//     text-align: left;
//     margin: none;
//     color: white;
//     text-decoration: none;
//     font-size: 20px;
//     box-sizing: border-box;
//     padding: 10px;

//     &:hover {
//       text-decoration: underline;
//     }
//   }
// }
</style>
