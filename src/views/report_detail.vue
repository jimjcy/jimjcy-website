<script setup>
import constant from "@/constant";
import moment from "moment";
const data = ref({});
const route = useRoute();
console.log(route.params.id);
onBeforeMount(async () => {
  const res = await constant.req.post("/get_issue", {
    id: route.params.id,
    page: 0,
  });
  data.value = res.data.result[0];
  data.value.date = moment(data.value.date).format("YYYY-MM-DD HH:mm:ss");
  console.log(data.value);
});
</script>
<template>
  <div class="content">
    <h1 class="title">{{ data.title }}</h1>
    <div class="info">
      <span>反馈人：{{ data.username }}</span>
      <span>时间：{{ data.date }}</span>
      <span>状态：{{ data.status === 1 ? "未处理" : "已处理" }}</span>
    </div>
    <h2 class="title">复现步骤/问题描述</h2>
    <div class="block">
      <span v-text="data.description"></span>
    </div>
    <h2 class="title">管理员回复</h2>
    <div class="block">
      <span v-if="data.reply" v-text="data.reply"></span>
      <span v-else>暂无回复</span>
    </div>
    <div class="center">
      <click-button class="but" @click="$router.back()"
        >返回上一页</click-button
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/themes.scss";
.content {
  padding: 20px;
  * {
    margin: 15px 0;
  }
  .info {
    span {
      font-size: 1.1em;
      margin-right: 12px;
      @include useTheme {
        color: getTheme(text-color);
      }
    }
  }
  .block {
    padding: 15px;
  }
  .center .but {
    font-size: 1em;
    padding: 10px;
  }
}
</style>
