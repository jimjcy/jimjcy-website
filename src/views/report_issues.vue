<script setup>
import constant from "@/constant";
import moment from "moment";
const router = useRouter();
const currentPage = ref(1);
const currentPageData = ref([]);
const pagesData = ref({});
// watchEffect(() => {
//   localStorage.reportPage = currentPage.value;
// });
async function getPageIssue(cp, init = false) {
  if (pagesData.value[cp] === undefined) {
    const res = await constant.req.post("/get_issue", {
      page: cp,
      id: 0,
    });
    const data = res.data;
    if (data.status) {
      data.result.reverse();
      pagesData.value[cp] = data.result;
    } else {
      currentPage.value--;
      return;
    }
  }
  let ind = 0;
  // const currentLength = currentPageData.value.length;
  // for (let i = 0; i < currentPageData.value.length; i++)  {
  //   // setTimeout(() => {
  //   //   currentPageData.value.shift();
  //   // }, 50 * i);
  //   currentPageData.value.shift();
  //   ind++;
  // }
  while (currentPageData.value.length > 0) {
    currentPageData.value.shift();
  }
  pagesData.value[cp].forEach((item, index) => {
    setTimeout(() => {
      item.date = moment(item.date).format("YYYY-MM-DD HH:mm:ss");
      currentPageData.value.push(item);
      // console.log(ind);
    }, 100 * index);
    ind++;
  });
  // if (ind < 5) {
  //   for (let i = ind; i < 5; i++) {
  //     setTimeout(() => {
  //       if (!init) currentPageData.value.shift();
  //     }, 250 * i);
  //   }
  // }
}
function topre() {
  if (currentPage.value > 1) {
    currentPage.value--;
    getPageIssue(currentPage.value);
  }
}
function tonext() {
  currentPage.value++;
  getPageIssue(currentPage.value);
}
onMounted(() => {
  getPageIssue(currentPage.value, true);
});
</script>
<template>
  <h1 class="title">报告问题</h1>
  <h3 class="title">
    如果在使用网站的过程中发现什么奇奇怪怪的小问题欢迎提出，会第一时间进行修复哦awa
  </h3>
  <div class="change">
    <click-button @click="topre" class="but">上一页</click-button>
    <p>{{ currentPage }}</p>
    <click-button @click="tonext" class="but">下一页</click-button>
  </div>
  <TransitionGroup name="content" tag="div">
    <div class="block" v-for="issue in currentPageData" :key="issue">
      <h4>{{ issue.title }}</h4>
      <p>提交用户：{{ issue.username }}</p>
      <p>提交时间：{{ issue.date }}</p>
      <p>提交id：{{ issue.id }}</p>
      <p>当前状态：{{ issue.status }}</p>
      <click-button @click="router.push('/report/' + issue.id)"
        >详细信息</click-button
      >
    </div>
  </TransitionGroup>
</template>
<style scoped>
.block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  width: calc(100% - 30px);
  * {
    margin: 5px 0;
  }
  .but {
    padding: 5px 15px;
    font-size: 1.2em;
  }
}
.title {
  text-align: center;
}
.change {
  display: flex;
  justify-content: center;
  align-items: center;
  .but {
    height: 50px;
    margin: 10px 15px;
    padding: 20px;
  }
}
.content-enter-active,
.content-leave-active,
.content-move {
  transition: all 0.25s ease-in-out;
}
.content-enter-from {
  opacity: 0;
  transform: translate(20px, 20px);
}
.content-leave-to {
  opacity: 0;
  transform: translate(-20px, -20px);
}
.content-leave-active {
  position: absolute;
}
</style>
