<script lang="ts" setup>
import utils from '@/common/utils';
const router = useRouter();
const title = ref('');
const description = ref('');
async function submitFeedback() {
  if (title.value.trim() === '' || description.value.trim() === '') {
    alert('标题和描述不能为空！');
    return;
  }
  const res = await utils.req.post('/new/feedback', {
    title: title.value,
    description: description.value,
    sessionid: localStorage.sessionid,
  });
  if (res.data.status) {
    alert('反馈提交成功！感谢你的反馈，我们会尽快处理。');
    router.push('/feedback');
  } else {
    alert('反馈提交失败，请稍后重试。');
  }
}
</script>
<template>
  <div class="content">
    <click-button class="back" @click="router.push('/feedback')"><p>上一页</p></click-button>
    <h1 class="title center">新的反馈</h1>
    <div class="block center">
      <text-line class="input" v-model="title" title="输入标题"></text-line>
      <text-area
        class="text"
        v-model="description"
        title="请详细描述你遇到的问题以及复现步骤"
      ></text-area>
      <click-button class="but" @click="submitFeedback()"><p>提交反馈</p></click-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.content {
  .back {
    margin: 5px;
    padding: 15px 15px;
    p {
      margin: 0;
    }
  }
  .title {
    margin: 20px 0;
  }
  .block {
    padding: 20px;
    .input {
      width: calc(100% - 30px);
      margin: 20px 0;
    }
    .text {
      height: 20em;
      width: calc(100% - 10px);
    }
    .but {
      padding: 5px 15px;
      font-size: 1.1em;
      margin: 20px 0;
    }
  }
}
</style>
