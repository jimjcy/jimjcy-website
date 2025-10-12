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
      image.value = response.data;
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
    <h1>找回密码</h1>
  <div class="block form">
    <div class="input_box">
      <p>邮箱：</p>
      <input type="text" placeholder="邮箱" v-model="email" />
    </div>
    <div class="input_box">
      <p>要修改的密码：</p>
      <input type="password" placeholder="要修改的密码" v-model="password" />
    </div>
    <div class="input_box">
      <p>验证码：</p>
      <input type="text" placeholder="验证码" maxlength="4" v-model="code" />
      <img alt="验证码" @click="imageReload" :src="image" />
    </div>
    <div class="input_box">
      <p>邮箱验证码：</p>
      <input
        type="text"
        placeholder="邮箱验证码"
        maxlength="5"
        v-model="email_code"
      />
      <input
        type="submit"
        value="发送验证码"
        @click="send_email"
        ref="email_code_button"
      />
    </div>
    <p class="error" v-text="error"></p>
    <p>
      没有账号？<RouterLink class="links" to="/register">去注册</RouterLink>
      要登录？<RouterLink class="links" to="/login">去登录</RouterLink>
    </p>
    <input type="submit" value="确定" @click="submit_button" />
  </div>
</template>

<style lang="scss" scoped>
.input_box {
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  align-content: center;
}

.block {
  text-align: center;
  align-content: center;
  align-items: center;
  justify-content: center;
  background-color: #5eadf2;
  border-radius: 25px;
  margin: 15px;

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    text-align: center;
    color: white;
  }

  a {
    text-decoration: none;
    color: yellow;

    &:hover {
      background-color: orangered;
      color: white;
      transition: all 0.5s;
    }
  }
}

.form {
  input[type="text"],
  input[type="password"] {
    font-size: medium;
    border: none;
    outline: none;
    width: 250px;
    height: 30px;
    background-color: yellowgreen;
    margin-top: 5px;

    &::placeholder {
      color: white;
    }
  }

  input[type="submit"] {
    font-size: medium;
    border: none;
    outline: none;
    width: 150px;
    height: 30px;
    background-color: red;
    margin-top: 5px;
    margin-bottom: 5px;

    &:hover {
      background-color: orangered;
      color: white;
      transition: all 0.5s;
    }
  }

  img {
    vertical-align: middle;
    margin-top: 5px;
    margin-bottom: 5px;
    width: 150px;
    block-size: 30px;
  }
}

.error {
  background-color: red;
  font-size: small;
  text-align: center;
}
</style>
