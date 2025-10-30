<script setup>
import colorButton from "@/component/input/clickButton.vue";
import axios from "axios";
import hljs from "highlight.js";
import "highlight.js/styles/dark.css";
import io from "socket.io-client";
import moment from "moment";

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
socket.on("data", function (data) {
  if (data.id === socket.id) {
    console.log(data.result);
    for (let i = data.result.length - 1; i >= 0; i--) {
      data.result[i].date = moment(data.result[i].date).format("YYYY-MM-DD HH:mm:ss");
      message_list.value.unshift(data.result[i]);
    }
    lastId = data.result[0].id;
  }
});
socket.on("new", (data) => {
  message_list.value.push(data);
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
  if (message.value === "") {
    error.value = "请输入内容";
    return;
  }
  if (message.value.length > 300) {
    error.value = "内容过长";
    return;
  }
  socket.emit("send", {
    username: username.value,
    content: message.value,
  });
  message.value = "";
}
onMounted(() => {
  socket.connect();
  watch(
    message_list,
    () => {
      nextTick(() => {
        history.value.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    },
    // { deep: true, once: true }
    { deep: true }
  );
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
        <colorButton
          text="获取更多"
          style="padding: 15px; font-size: 17px"
          @click="getMore"
          v-if="lastId !== 1"
        />
        <p v-else>好像没有更多了哦</p>
      </div>
      <!-- -->
      <div v-for="message in message_list" :key="message.id">
        <div class="left_message_box" v-if="message.username !== username">
          <div class="info">
            <p class="user">{{ message.username }}</p>
            <p class="time">{{ message.date.substring(0, 10) }}</p>
            <p class="time">{{ message.date.substring(11, 19) }}</p>
          </div>
          <div class="message_content">
            <p>{{ message.content }}</p>
          </div>
        </div>
        <div class="right_message_box" v-else>
          <div class="message_content">
            <p>{{ message.content }}</p>
          </div>
          <div class="info">
            <p class="user">{{ username }}</p>
            <p class="time">{{ message.date.substring(0, 10) }}</p>
            <p class="time">{{ message.date.substring(11, 19) }}</p>
          </div>
        </div>
      </div>
      <!-- -->
    </div>
    <div class="input">
      <p class="error">{{ error }}</p>
      <textarea
        v-model="message"
        class="input_box"
        placeholder="按下Ctrl+Enter以发送"
        @keyup.ctrl.enter="sendMessage"
      ></textarea>
      <input
        type="button"
        value="发送"
        @click="sendMessage"
        class="submit"
        ref="submit"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/themes.scss" as *;
p {
  margin-left: 15px;
  margin-right: 15px;
}

.middle {
  align-items: center;
  text-align: center;
  margin-bottom: 10px;
  color: white;
}

.chat {
  display: flex;
  height: 100%;
  flex-direction: column;

  .history {
    background-color: #5eadf2;
    overflow-y: scroll;
    flex: 1 1 0;
    scrollbar-width: thin;
  }

  .input {
    background-color: #0476d9;
    height: 250px;
    flex: 0 0 auto;
  }
}

.select {
  width: 100%;
  border: none;
  background-color: yellowgreen;
  font-size: 17.5px;
  border-radius: 25px;
  align-content: center;
  text-align: center;
  outline: none;
  margin-top: 10px;
  margin-bottom: 10px;
}

.submit {
  width: 100%;
  border: none;
  background-color: #f29c50;
  color: black;
  font-size: 20px;
  border-radius: 25px;
  margin-bottom: 10px;

  &:hover {
    background-color: #f29c50;
    color: white;
    transition: all 0.5s;
  }
}

.input_box {
  margin-top: 10px;
  width: 100%;
  background-color: yellowgreen;
  height: 100px;
  border: none;
  resize: none;
  outline: none;
  font-size: 20px;
}

.error {
  background-color: red;
  font-size: small;
  text-align: center;
}

.left_message_box {
  display: flex;
  margin-bottom: 5px;
  align-items: flex-start;
}

.right_message_box {
  display: flex;
  justify-content: right;
  margin-bottom: 5px;
  align-items: flex-start;
}

.message_content {
  background-color: #f29c50;
  border-radius: 10px;
  margin-left: 15px;
  margin-right: 15px;
  white-space: pre-wrap;
  word-break: break-all;
}

.user {
  margin-left: 15px;
  margin-right: 15px;
}
</style>
