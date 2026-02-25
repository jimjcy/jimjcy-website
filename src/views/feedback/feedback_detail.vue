<script lang="ts" setup>
import constant from '@/constant'
import moment from 'moment'
const route = useRoute()
const router = useRouter()

const data = ref({})
const isAdmin = ref(false)
const status = ref(0)
const reply = ref('')
const setStatus = ref('')

const showedStatus = computed(() => {
  if (status.value === 0) return '等待处理'
  else if (status.value === 1) return '已关闭'
  else if (status.value === 2) return '已完成'
  else return '未知状态'
})
console.log(route.params.id)
onBeforeMount(async () => {
  let res = await constant.req.post('/get/feedback', {
    id: route.params.id,
    page: 0,
  })
  data.value = res.data.result[0]
  status.value = data.value.status
  reply.value = data.value.reply
  data.value.date = moment(data.value.date).format('YYYY-MM-DD HH:mm:ss')
  // console.log(data.value);
  res = await constant.req.post('/login/check', {
    sessionid: localStorage.sessionid,
  })
  if (res.data.group === 'admin') {
    isAdmin.value = true
  } else {
    isAdmin.value = false
  }
})
async function setReply() {
  const res = await constant.req.post('/set/feedback', {
    id: route.params.id,
    status: status.value,
    reply: reply.value,
  })
  if (res.data.status) {
    setStatus.value = 'OK'
  }
}
</script>
<template>
  <div class="content">
    <h1 class="title">{{ data.title }}</h1>
    <div class="info">
      <span>反馈人：{{ data.username }}</span>
      <span>时间：{{ data.date }}</span>
      <span>状态：{{ showedStatus }}</span>
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
    <h2 class="title" v-if="isAdmin">面板</h2>
    <div class="block" v-if="isAdmin">
      <div class="row">
        <p>设置状态</p>
        <select v-model="status">
          <option value="0">等待处理</option>
          <option value="1">已关闭</option>
          <option value="2">已完成</option>
        </select>
      </div>
      <p>留言</p>
      <text-area class="input" title="输入留言" v-model="reply"></text-area>
      <div class="row but">
        <click-button class="middle" @click="setReply()"><p>保存</p></click-button>
      </div>
      <div class="row">
        <p>{{ setStatus }}</p>
      </div>
    </div>
    <div class="center">
      <click-button class="but" @click="router.push('/feedback')">返回上一页</click-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '@/styles/themes.scss' as *;
.content {
  padding: 20px;
  // h1, h2, h3, h4 {
  //   @include useTheme() {
  //     color: getTheme(text-color);
  //   }
  // }
  .info {
    span {
      font-size: 1.1em;
      margin-right: 12px;
      @include useTheme() {
        color: getTheme(text-color);
      }
    }
  }
  .block {
    padding: 15px;
    .input {
      margin: 0;
      width: 100%;
      height: 6em;
    }
  }
  .center .but {
    font-size: 1em;
    padding: 10px;
  }
}
.row {
  margin: 5px 0;
  * {
    margin: 0 10px;
  }
  .but {
    font-size: 1em;
    padding: 10px;
  }
}
</style>
