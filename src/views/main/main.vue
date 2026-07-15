<script lang="ts" setup>
const pageEle = useTemplateRef('pageEle');

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
const introData = reactive<introType[]>([
  {
    title: '基本信息',
    subheading: 'Basic Information',
    content: [
      '大家好呀~我是小井井',
      '今年14，马上要读初三了呢，坐标广东佛山（江西赣州）',
      '不太喜欢打大型游戏（三分钟热度？），主玩休闲游戏如打歌、Steam上的休闲游戏以及MC',
      '性格偏内向，如果熟了就不会了，INFJ',
      '爱好主要为写代码。？',
      '是个吃货呢，基本啥都能吃？',
    ],
  },
  {
    title: '网站信息',
    subheading: 'Website Information',
    content: [
      '本网站使用Vue框架+VueRouter与Typescript制作',
      '后端为Express框架',
      '如有问题欢迎联系mailto:771732203@qq.com进行反馈',
      '目前主要的功能有：AI以及聊天（不要问我别的是什么，问就是没写完。。',
    ],
  },
  {
    title: '未来计划',
    subheading: 'Future Planning',
    content: [
      '一是把这个网站完善了，如果看过我之前这个网站的应该知道我还有很多东西没有写',
      '二是准备写一个华为的ArkTS应用，暂不透露是什么哦',
      '三是当一个OIer，把CSP打了',
      '四是中考加油++rp！',
    ],
  },
]);

const introPartNumber = introData.length;

interface linkType {
  name: string;
  showRoute: string;
  rawRoute: string;
  isOut: boolean;
}
const linksData = reactive<linkType[]>([
  {
    name: '主页',
    showRoute: '/home',
    rawRoute: '/',
    isOut: false,
  },
  {
    name: 'ai聊天',
    showRoute: '/ai_chatting',
    rawRoute: '/ai_chatting',
    isOut: false,
  },
  {
    name: '聊天室',
    showRoute: '/chatting_room',
    rawRoute: '/chatting_room',
    isOut: false,
  },
  {
    name: '联系方式',
    showRoute: '/about',
    rawRoute: '/about',
    isOut: false,
  },
  {
    name: 'Github',
    showRoute: 'github.com',
    rawRoute: 'https://github.com/jimjcy',
    isOut: true,
  },
  {
    name: 'Gitee',
    showRoute: 'gitee.com',
    rawRoute: 'https://www.gitee.com/jimjcy',
    isOut: true,
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
    <div class="first-page">
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
          <div class="intro" v-for="detail in introData">
            <p class="heading">{{ detail.title }}</p>
            <p class="subheading">{{ detail.subheading }}</p>
            <div class="lines">
              <p v-for="line in detail.content" v-text="line"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="links-scroll">
      <div class="links-area">
        <p class="heading">一些链接</p>
        <p class="subheading">Some Links</p>
        <div class="links-list">
          <div class="link-box" v-for="link in linksData">
            <RouterLink v-if="!link.isOut" class="link" :to="link.rawRoute">
              <p class="name">{{ link.name }}</p>
              <p class="route">{{ link.showRoute }}</p>
            </RouterLink>
            <a v-else class="link" :href="link.rawRoute" target="_blank">
              <p class="name">{{ link.name }}</p>
              <p class="route">{{ link.showRoute }}</p>
            </a>
          </div>
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
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../styles/themes.scss' as *;

$headerHeight: 5em;
$viewportHeight: calc(var(--viewport-height) * 1px);

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

.links-scroll {
  height: calc($viewportHeight * 2);
  width: 100%;
  .links-area {
    position: sticky;
    height: $viewportHeight;
    width: 100%;
    top: 0;
    box-sizing: border-box;
    padding: 5em 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @include useTheme {
      color: getTheme(text-color);
    }
    .heading {
      margin: 0;
      font-size: 5em;
    }
    .subheading {
      font-size: 3em;
      margin: 20px;
    }
    .links-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      max-width: 80%;
      .link-box {
        .link {
          all: inherit;
          cursor: pointer;
          text-align: center;
          min-width: 5em;
          padding: 15px;
          margin: 10px;
          border-radius: 0.5em;
          @include useTheme {
            background-color: getTheme(background-color);
          }
        }
      }
    }
  }
}

.intro-list-scroll {
  height: calc($viewportHeight * var(--intro-part-number));
  width: 100%;

  .intro-list-area {
    position: sticky;
    height: $viewportHeight;
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
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 5em 0;
        @include useTheme {
          color: getTheme(text-color);
        }
        .heading {
          font-size: 5em;
          margin: 0;
        }
        .subheading {
          font-size: 3em;
          margin: 20px;
        }
        .lines {
          max-width: 80%;
          padding: 10px;
          border-radius: 0.5em;
          @include useTheme {
            background-color: getTheme(background-color);
          }
          p {
            font-size: 1.4em;
            margin: 5px;
          }
        }
      }
    }
  }
}

.first-page {
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
  margin: 20px 0;
  width: 100%;
  text-align: center;
  @include useTheme {
    color: getTheme(text-color);
    background-color: getTheme(background-color);
  }
  p {
    margin: 10px;
  }
  a {
    margin: 0 10px;
    @include useTheme {
      color: getTheme(text-color);
    }
  }
}
</style>
