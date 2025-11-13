<script setup>
import constant from "../constant";

const username = ref();
const password = ref();
const repassword = ref();
const email = ref();
const code = ref();
const email_code = ref();
const sex = ref("保密");

// const year = ref()
// const month = ref()
// const day = ref()
//
// const current_year = Date(Date.now()).split(' ')[3]
// const current_month = Date(Date.now()).split(' ')[1]
// let years = []
// for (let i=1970; i<current_year; i++) {
//     years.push(i)
// }
// let months = []
// for (let i=1; i<=12; i++) {
//   months.push(i)
// }
// let days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const error = ref();
const email_code_button = ref();

const router = useRouter();

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
    username.value === undefined ||
    password.value === undefined ||
    repassword.value === undefined ||
    email.value === undefined ||
    code.value === undefined ||
    sex.value === undefined
  ) {
    error.value = "请填写完整表单";
  } else if (email.value.indexOf("@") === -1) {
    error.value = "请填写正确的邮箱";
  } else {
    constant.req.post("/send_email", {
      codesession: localStorage.codesession,
      email: email.value,
    });
    window.alert("请求已发送，请查收邮件");
    startCountDown();
  }
}

function submit_button() {
  error.value = "";
  if (
    username.value === undefined ||
    password.value === undefined ||
    repassword.value === undefined ||
    email.value === undefined ||
    code.value === undefined ||
    email_code.value === undefined ||
    sex.value === undefined
  ) {
    error.value = "请填写完整表单";
  } else if (email.value.indexOf("@") === -1) {
    error.value = "请填写正确的邮箱";
  } // else if ('?') {}
  else {
    constant.req
      .post("/register", {
        codesession: localStorage.codesession,
        username: username.value,
        password: password.value,
        repassword: repassword.value,
        email: email.value,
        code: code.value,
        email_code: email_code.value,
        sex: sex.value,
      })
      .then((response) => {
        if (response.data.status) {
          window.alert("注册成功！");
          router.push("/login");
        } else {
          error.value = response.data.errorMessage;
        }
      });
  }
}
</script>

<template>
  <h1 class="title">注册</h1>
  <div class="block center">
    <text-line class="text" title="用户名" v-model="username" />
    <text-line class="text" title="密码" v-model="username" type="password" />
    <text-line
      class="text"
      title="确认密码"
      v-model="username"
      type="password"
    />
    <text-line class="text" title="邮箱" v-model="username" />
    <div class="code">
      <p>性别：</p>
      <select v-model="sex">
        <option value="保密" selected>保密</option>
        <option value="男">男</option>
        <option value="女">女</option>
        <option value="未知">未知</option>
      </select>
    </div>
    <div class="code">
      <text-line class="text" title="验证码" v-model="code" />
      <img alt="验证码" @click="imageReload" :src="image" />
    </div>
    <div class="code">
      <text-line class="text" title="邮箱验证码" v-model="email_code" />
      <click-button @click="send_email"><p>发送验证码</p></click-button>
    </div>
    <!--    <div class="input_box">-->
    <!--      <select v-model="year">-->
    <!--        <option v-for="year in years" v-text="year" :name="year"></option>-->
    <!--      </select>-->
    <!--    </div>-->
    <p class="error" v-text="error"></p>
    <p>
      已有账号？<RouterLink to="/login">去登录</RouterLink>
      忘记密码？<RouterLink to="/forget_password">去找回</RouterLink>
    </p>
    <click-button class="but" @click="submit_button">
      <p>注册</p>
    </click-button>
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
  select {
    margin-left: 20px;
    height: 50px;
    font-size: 1.2em;
    border: 2px solid;
    outline: none;
    border-radius: 0.5em;
    @include useTheme {
      background-color: getTheme(background-color);
    }
  }
}
</style>
