<script setup>
import constant from "../constant";

const email = ref("");
const password = ref("");
const code = ref("");
const email_code = ref("");
const error = ref("");

const email_code_button = useTemplateRef("");
const router = useRouter();

if (localStorage.codesession === undefined) {
  constant.req.post("/generate_token").then((response) => {
    localStorage.codesession = response.data;
  });
}

function startCountDown() {
  let duration = 60;
  let startButton = email_code_button.value;
  startButton.disabled = true;
  let timer = setInterval(function () {
    if (duration <= 0) {
      clearInterval(timer);
      startButton.value = "发送验证码";
      startButton.disabled = false;
    } else {
      startButton.value = duration + "s";
      duration--;
    }
  }, 1000);
}

const image = ref();
function imageReload() {
  constant.req
    .post("/get_image", {
      codesession: localStorage.codesession,
    })
    .then((response) => {
      image.value = "data:image/svg+xml;base64," + btoa(response.data);
    });
}
imageReload();

function send_email() {
  if (
    email.value === undefined ||
    password.value === undefined ||
    code.value === undefined
  ) {
    error.value = "请填写完整的表单";
  } else if (email.value.indexOf("@") === -1) {
    error.value = "请填写正确的邮箱";
  } else {
    constant.req.post("/send_email", {
      email: email.value,
      codesession: localStorage.codesession,
    });
    window.alert("请求已发送，请查收邮件");
    startCountDown();
  }
}

function submit_button() {
  if (
    email.value === undefined ||
    password.value === undefined ||
    code.value === undefined ||
    email_code.value === undefined
  ) {
    error.value = "请填写完整的表单";
  } else if (email.value.indexOf("@") === -1) {
    error.value = "请填写正确的邮箱";
  } else {
    constant.req
      .post("/forget_password", {
        email: email.value,
        password: password.value,
        code: code.value,
        email_code: email_code.value,
        codesession: localStorage.codesession,
      })
      .then((response) => {
        if (response.data.status) {
          router.push("/login");
        } else {
          error.value = response.data.errorMessage;
        }
      });
  }
}
</script>

<template>
  <h1 class="title">找回密码</h1>
  <div class="block center">
    <text-line class="text" title="邮箱" v-model="email" />
    <text-line
      class="text"
      title="要修改的密码"
      v-model="password"
      type="password"
    />
    <div class="code">
      <text-line class="text" title="验证码" v-model="code" />
      <img alt="验证码" @click="imageReload" :src="image" />
    </div>
    <div class="code">
      <text-line class="text" title="邮箱验证码" v-model="email_code" />
      <click-button @click="send_email" ref="email_code_button"
        ><p>发送验证码</p></click-button
      >
    </div>
    <p class="error" v-text="error"></p>
    <p>
      没有账号？<RouterLink class="links" to="/register">去注册</RouterLink>
      要登录？<RouterLink class="links" to="/login">去登录</RouterLink>
    </p>
    <click-button class="but" @click="submit_button"><p>确定</p></click-button>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/themes.scss" as *;

.title {
  text-align: center;
}
.text {
  margin-top: 50px;
  width: 17em;
  height: 2em;
}
.but {
  font-size: 1.2em;
  width: 7em;
}
.code {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    margin-left: 20px;
    height: 50px;
    cursor: pointer;
  }
  button {
    margin-left: 20px;
    height: 50px;
  }
}
</style>
