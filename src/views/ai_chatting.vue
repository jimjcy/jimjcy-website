<script setup>
import axios from "axios";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/dark.css";
import io from "socket.io-client";
import constant from "@/constant";

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
      }
    });
});
onMounted(() => {
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
      <div class="left_message_box">
        <p class="user">System</p>
        <div class="message_content">
          <p>Now you can talk with AI!</p>
        </div>
      </div>
      <div
        v-for="message in message_list"
        :key="message.id"
        :class="message.role === 'assistant' ? 'left' : 'right'"
      >
        <div class="message-box">
          <p
            class="info"
            v-text="message.role === 'assistant' ? 'AI' : 'User'"
          ></p>
          <div class="content">
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
