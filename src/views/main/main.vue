<script lang="ts" setup>
import stickyContent from "./common/component/stickyContent.vue";
import flatScroll from "./common/component/flatScroll.vue";
</script>
<template>
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
  <flatScroll>
    <!-- // flat-scroll / FlatScroll -->
    <!-- <div class="intro" v-slide> -->
    <div class="intro">
      <div class="heading">网站信息</div>
      <div class="subheading">Website Information</div>
      <div class="gap"></div>
      <div class="text">
        <p>本网站使用Vue框架+VueRouter与Typescript制作</p>
        <p>后端为Express框架</p>
        <p>如有问题欢迎联系<a href="mailto:771732203@qq.com">771732203@qq.com</a>进行反馈</p>
        <p>目前主要的功能有：AI以及聊天（不要问我别的是什么，问就是没写完。。</p>
      </div>
    </div>
    <!-- <div class="intro" v-slide> -->
    <div class="intro">
      <div class="heading">网站信息</div>
      <div class="subheading">Website Information</div>
      <div class="gap"></div>
      <div class="text">
        <p>本网站使用Vue框架+VueRouter与Typescript制作</p>
        <p>后端为Express框架</p>
        <p>如有问题欢迎联系<a href="mailto:771732203@qq.com">771732203@qq.com</a>进行反馈</p>
        <p>目前主要的功能有：AI以及聊天（不要问我别的是什么，问就是没写完。。</p>
      </div>
    </div></flatScroll
  >
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
</template>

<style lang="scss" scoped>
@use "../../styles/themes.scss" as *;

// .stickybox {
//   width: 100%;
// }

.intro {
  min-width: calc(100% - 40px);
  height: calc(var(--viewport-height) * 1px - 40px - 5em);
  padding: 1em;
  margin: 0 20px;
  position: relative;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  .heading {
    position: relative;
    font-size: 2.3em;
    margin: 5px 0;
  }
  .subheading {
    position: relative;
    font-size: 1.2em;
    margin: 5px 0;
  }
  .gap {
    flex-grow: 1;
  }
  .text {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: end;
    p {
      font-size: 1.1em;
      margin: 5px 0;
      @include useTheme {
        color: getTheme(text-color);
      }
    }
  }
  @include useTheme {
    background-color: getTheme(background-color);
    color: getTheme(text-color);
  }
}

.links {
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
