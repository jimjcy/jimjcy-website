<script setup>
import axios from "axios";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/dark.css";
import io from "socket.io-client";

const username = ref("");
const message = ref("");
const message_list = ref([]);
const model = ref("qwen-long");
const error = ref("");
const submit = useTemplateRef("submit");
const history = useTemplateRef("history");

let isConnected = false;
// const model_list = {
//   "通义千问-long": "long",
//   "通义千问-turbo": "turbo",
//   "通义千问-plus": "plus",
//   "通义千问-max": "max",
//   deepseek: "deepseek",
// };

// marked.setOptions({
//   renderer: new marked.Renderer(),
//   highlight: function (code, language) {
//     const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
//     // return hljs.highlight(code, { language: language }).value;
//     return hljs.highlight(validLanguage, code).value;
//   },
//   gfm: true,
//   tables: true,
// });
// console.log(hljs.highlight("javascript", "console.log('Hello, world!')").value);
const socket = io("https://api.jimjcy.top", {
  path: "/ai/ws",
  transports: ["websocket"],
});

socket.on("connect", function () {
  isConnected = true;
});
socket.on("result", function (data) {
  if (data.id === socket.id) {
    message_list.value[data.index].content += data.result;
  }
  // message_list.value[data.index].content = marked.parse(
  //   message_list.value[data.index].content
  // );
});
socket.on("stop", function (data) {
  // message_list.value[data.index].content = marked.parse(
  //   message_list.value[data.index].content
  // );
  if (socket.id === data.id) {
    submit.value.value = "发送";
    submit.value.disabled = false;
  }
});
function sendMessage() {
  if (!isConnected) {
    error.value = "服务连接失败，请稍后再试";
    return;
  }
  error.value = "";
  if (message.value === "") {
    error.value = "请输入内容";
    return;
  }
  message_list.value.push({ role: "user", content: message.value });
  message.value = "";
  submit.value.value = "生成中······";
  submit.value.disabled = true;
  socket.emit("ask", {
    message_list: message_list.value,
    model: model.value,
    index: message_list.value.length,
  });
  message_list.value.push({ role: "assistant", content: "" });
}
onMounted(() => {
  socket.connect();
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
    { deep: true }
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
      <!-- -->
      <div class="left_message_box">
        <p class="user">System</p>
        <div class="message_content">
          <p>Now you can talk with AI!</p>
        </div>
      </div>
      <div v-for="message in message_list" :key="message.id">
        <div class="left_message_box" v-if="message.role === 'assistant'">
          <p class="user">AI</p>
          <div class="message_content">
            <!-- <article
            class="left_message_content"
            v-html="marked.parse(message.content)"
          ></article> -->
            <p>{{ message.content }}</p>
            <!-- <VueShowdown
              :markdown="message.content"
              flavor="vanilla"
            ></VueShowdown> -->
            <!-- <p class="left_token">token: {{ message.token }}</p> -->
          </div>
        </div>
        <div class="right_message_box" v-else>
          <div class="message_content">
            <p>{{ message.content }}</p>
          </div>
          <p class="user">{{ username }}</p>
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
      <select v-model="model" class="select">
        <option value="qwen-long">通义千问-long</option>
        <option value="qwen-turbo">通义千问-turbo</option>
        <option value="qwen-plus">通义千问-plus</option>
        <option value="qwen-max">通义千问-max</option>
        <option value="qwq-plus">通义qwq-plus</option>
        <option value="deepseek">deepseek</option>
      </select>
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
p {
  margin-left: 15px;
  margin-right: 15px;
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
}

.right_message_box {
  display: flex;
  justify-content: right;
  margin-bottom: 5px;
}

.message_content {
  background-color: #f29c50;
  border-radius: 10px;
  margin-left: 15px;
  margin-right: 15px;
}

.user {
  margin-left: 15px;
  margin-right: 15px;
}
</style>
