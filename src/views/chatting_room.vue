<script setup>
import colorButton from "@/component/input/clickButton.vue";
import axios from "axios";
import hljs from "highlight.js";
import "highlight.js/styles/dark.css";
import io from "socket.io-client";
import moment from "moment";
import constant from "@/constant";
import { onBeforeMount } from "vue";

const username = ref("");
const message = ref("");
const message_list = ref([]);
const error = ref("");
const history = useTemplateRef("history");

let isConnected = false;
let lastId;

const socket = io("https://api.jimjcy.top", {
  path: "/chat/ws",
  transports: ["websocket"],
});
socket.on("connect", function () {
  isConnected = true;
  socket.emit("get", { end: "end", length: 15 });
});
socket.on("history", function (data) {
  if (data.id === socket.id) {
    console.log(data.result);
    for (let i = data.result.length - 1; i >= 0; i--) {
      data.result[i].date = moment(data.result[i].date).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      message_list.value.unshift(data.result[i]);
    }
    lastId = data.result[0].id;
  }
});
socket.on("new", (data) => {
  message_list.value.push(data);
  nextTick(() => {
    history.value.scrollTo({
      top: history.value.scrollHeight,
      behavior: "smooth",
    });
  });
});
function getMore() {
  if (!isConnected) {
    error.value = "服务连接失败，请稍后再试";
    return;
  }
  socket.emit("get", { end: lastId, length: 15 });
}
function sendMessage() {
  error.value = "";
  if (!isConnected) {
    error.value = "服务连接失败，请稍后再试";
    return;
  }
  if (message.value.trim() === "") {
    error.value = "请输入内容";
    return;
  }
  // if (message.value.length > 300) {
  //   error.value = "内容过长";
  //   return;
  // }
  socket.emit("send", {
    username: username.value,
    content: message.value.trim(),
  });
  message.value = "";
}
const router = useRouter();
onBeforeMount(() => {
  socket.connect();
  constant.req
    .post("/login/check", {
      sessionid: localStorage.sessionid,
    })
    .then((response) => {
      if (!response.data.status) {
        router.push("/login");
      } else {
        username.value = response.data.username;
      }
    });
});
onMounted(() => {
  // watch(
  //   message_list,
  //   () => {
  //     nextTick(() => {
  //       history.value.scrollTo({
  //         top: 0,
  //         behavior: "smooth",
  //       });
  //     });
  //   },
  //   // { deep: true, once: true }
  //   { deep: true }
  // );
  watch(
    message_list,
    () => {
      nextTick(() => {
        history.value.scrollTo({
          top: history.value.scrollHeight,
          behavior: "smooth",
        });
      });
    },
    { deep: true, once: true }
    // { deep: true }
  );
});
onUnmounted(() => {
  socket.disconnect();
  isConnected = false;
});
</script>

<template>
  <div class="chat">
    <div class="history" ref="history">
      <div class="middle">
        <click-button @click="getMore" v-if="lastId !== 1" class="but"
          ><p>获取更多</p></click-button
        >
        <p class="text" v-else>好像没有更多了哦~</p>
      </div>
      <div
        v-for="message in message_list"
        :key="message.id"
        :class="message.username !== username ? 'left' : 'right'"
      >
        <div class="message-box">
          <div class="info">
            <p>
              {{ message.username === username ? "" : message.username }}
              {{ message.date.substring(0, 10) }}
              {{ message.date.substring(11, 19) }}
            </p>
          </div>
          <div class="content">
            <p>{{ message.content }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="input">
      <text-area
        class="text"
        v-model="message"
        title="按下Ctrl+Enter以发送"
        @keyup.ctrl.enter="sendMessage"
      ></text-area>
      <click-button @click="sendMessage" class="but"><p>发送</p></click-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/themes.scss" as *;

.chat {
  height: 100%;
  width: 100%;
  @include useTheme {
    background-color: getTheme(background-color);
  }
  .history {
    height: calc(100% - 10em - 4px);
    overflow-y: scroll;
    overflow-x: auto;
    padding: 0 2px;
    scrollbar-width: thin;
    display: flex;
    flex-direction: column;
    .middle {
      align-self: center;
      .text,
      .but {
        margin: 20px 0;
        height: 3em;
        width: 10em;
        font-size: 1.3em;
      }
    }
    .left {
      align-self: flex-start;
      margin-left: 10px;
      .message-box {
        .info {
          text-align: left;
        }
        // .content {
        //   position: relative;
        //   left: 0;
        // }
      }
    }
    .right {
      align-self: flex-end;
      margin-right: 10px;
      .message-box {
        .info {
          text-align: right;
        }
        // .content {
        //   position: relative;
        //   right: 0;
        // }
      }
    }
    .left,
    .right {
      margin-bottom: 15px;
      .message-box {
        .content {
          padding: 20px;
          min-width: 3em;
          // max-width: max(100%, 50em);
          max-width: 40em;
          overflow-x: auto;
          border-radius: 10px;
          font-size: 1.1em;
          // width: fit-content;
          @include useTheme {
            background-color: getTheme(hover-color);
            border: solid 2px getTheme(border-color);
            color: getTheme(text-color);
          }
          p {
            margin: 0;
            word-wrap: break-word;
            white-space: pre-wrap;
          }
        }
      }
    }
  }
  .input {
    height: 10em;
    position: relative;
    @include useTheme {
      border: solid 2px getTheme(border-color);
    }
    .text {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      height: calc(100% - 4px);
    }
    .but {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 1.3em;
      height: 2.5em;
      width: 7em;
      opacity: 0.5;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
