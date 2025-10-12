<script setup>
const info = {
  QQ: {
    name: "771732203",
    url: "https://qm.qq.com/cgi-bin/qm/qr?k=vqy3IdrB90OaKlwk8BLE8JGass3Ji0Nn",
  },
  微信: { name: "xiaojingjing_jim" },
  bilibili: {
    name: "小井井jimjcy",
    url: "https://space.bilibili.com/519179845",
  },
  抖音: { name: "小井井" },
  Github: { name: "jimjcy", url: "https://github.com/jimjcy" },
  Email: { name: "771732203@qq.com", url: "mailto: 771732203@qq.com" },
};
</script>
<template>
  <h1 class="title">联系我</h1>
  <div class="block" v-for="(value, key) in info" :key="key">
    <h1 class="method">{{ key }}</h1>
    <a class="content" :href="value.url" target="_blank">{{ value.name }}</a>
  </div>
</template>
<style lang="scss" scoped>
@use '../styles/themes.scss' as *;

.title {
  text-align: center;
}

.block {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 75px;

  @include useTheme {
    background-color: getTheme(background-color);
  }

  .method {
    width: 50%;
    text-align: right;
    margin: 0;
    box-sizing: border-box;
    padding: 10px;
  }

  .content {
    flex: 1;
    text-align: left;
    margin: none;
    color: white;
    text-decoration: none;
    font-size: 20px;
    box-sizing: border-box;
    padding: 10px;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
