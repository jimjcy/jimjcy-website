<script lang="ts" setup>
import ClickButton from '@/component/input/clickButton.vue'

const router = useRouter()
const route = useRoute()
</script>
<template>
  <div class="content">
    <h1>404</h1>
    <p>未知链接{{ route.path }}</p>
  </div>
  <div class="center">
    <click-button class="but" @click="router.back()">返回上一页</click-button>
  </div>
</template>
<style lang="scss" scoped>
@use '@/styles/themes.scss' as *;
.content {
  padding: 20px;
  text-align: center;
  @include useTheme() {
    color: getTheme(text-color);
  }
  h1 {
    font-size: 8em;
    margin: 0;
  }
  p {
    font-size: 1.5em;
  }
  .center .but {
    font-size: 1em;
    padding: 10px;
  }
}
</style>
