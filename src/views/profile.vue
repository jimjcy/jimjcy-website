<script setup>
import constant from "../constant";

const router = useRouter();

const text = ref("");
const username = ref("");
const sex = ref("");
const code = ref("");
const password_before = ref("");
const password_new = ref("");
const email = ref("");
const email_code = ref("");
const email_code_button = ref("");
const error = ref("");

constant.req
  .post("/login/check", {
    sessionid: localStorage.sessionid,
  })
  .then((response) => {
    if (!response.data.status) {
      router.push("/login");
    } else {
      username.value = response.data.username;
      sex.value = response.data.sex;
      text.value = response.data.username + "的个人资料";
    }
  });

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

function send_email() {
  if (email.value === undefined || code.value === undefined) {
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

function reset_username() {
  error.value = "";
  if (username.value === undefined || code.value === undefined) {
    error.value = "请填写完整的表单";
  } else {
    constant.req
      .post("/reset/username", {
        username: username.value,
        code: code.value,
        sessionid: localStorage.sessionid,
        codesession: localStorage.codesession,
      })
      .then((response) => {
        if (response.data.status) {
          window.alert("修改成功，将退出登录");
          logout();
        } else {
          error.value = response.data.errorMessage;
        }
      });
  }
}

function reset_sex() {
  error.value = "";
  if (sex.value === undefined || code.value === undefined) {
    error.value = "请填写完整的表单";
  } else {
    constant.req
      .post("/reset/sex", {
        sex: sex.value,
        code: code.value,
        sessionid: localStorage.sessionid,
        codesession: localStorage.codesession,
      })
      .then((response) => {
        if (response.data.status) {
          window.alert("修改成功");
          imageReload();
        } else {
          error.value = response.data.errorMessage;
        }
      });
  }
}

function reset_password() {
  error.value = "";
  if (
    password_new.value === undefined ||
    password_before.value === undefined ||
    code.value === undefined
  ) {
    error.value = "请填写完整的表单";
    // } else if (password_new.value.length < 6) {
    //   error.value = '密码长度不能小于6位'
  } else {
    constant.req
      .post("/reset/password", {
        password_before: password_before.value,
        password_new: password_new.value,
        code: code.value,
        sessionid: localStorage.sessionid,
        codesession: localStorage.codesession,
      })
      .then((response) => {
        if (response.data.status) {
          window.alert("修改成功");
          imageReload();
        } else {
          error.value = response.data.errorMessage;
        }
      });
  }
}

function reset_email() {
  error.value = "";
  if (
    email.value === undefined ||
    code.value === undefined ||
    email_code.value === undefined
  ) {
    error.value = "请填写完整表单";
  } else if (email.value.indexOf("@") === -1) {
    error.value = "请填写正确的邮箱";
  } // else if ('?') {}
  else {
    constant.req
      .post("/reset/email", {
        codesession: localStorage.codesession,
        sessionid: localStorage.sessionid,
        email: email.value,
        code: code.value,
        email_code: email_code.value,
      })
      .then((response) => {
        if (response.data.status) {
          window.alert("修改成功");
          imageReload();
        } else {
          error.value = response.data.errorMessage;
        }
      });
  }
}

function logout() {
  localStorage.sessionid = constant.LOGOUTSESSIONID;
  window.location.href = "/login";
}
</script>

<template>
  <h1 class="title" v-text="text"></h1>
  <div class="block center">
    <h2>基础信息</h2>
    <h3>用户名</h3>
    <text-line class="text" title="当前用户名" :value="username" />
    <div class="code">
      <text-line class="text" title="验证码" v-model="code" />
      <img :src="image" @click="imageReload" alt="验证码" />
    </div>
    <click-button class="but" @click="reset_username">
      <p>确定修改</p>
    </click-button>
    <!--*************************************************-->
    <h3>性别</h3>
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
      <img :src="image" @click="imageReload" alt="验证码" />
    </div>
    <click-button class="but" @click="reset_sex">
      <p>确定修改</p>
    </click-button>
  </div>
  <h4 class="error" v-text="error"></h4>
  <!--***********************************************-->
  <div class="block center">
    <h2>隐私设置</h2>
    <h3>密码设置</h3>
    <text-line
      class="text"
      title="原密码"
      :value="password_before"
      type="password"
    />
    <text-line
      class="text"
      title="新密码"
      :value="password_new"
      type="password"
    />
    <div class="code">
      <text-line class="text" title="验证码" v-model="code" />
      <img :src="image" @click="imageReload" alt="验证码" />
    </div>
    <click-button class="but" @click="reset_password">
      <p>确定修改</p>
    </click-button>
    <!--**********************************************-->
    <h3>邮箱设置</h3>
    <text-line class="text" title="修改的邮箱" :value="email" />
    <div class="code">
      <text-line class="text" title="验证码" v-model="code" />
      <img :src="image" @click="imageReload" alt="验证码" />
    </div>
    <div class="code">
      <text-line class="text" title="邮箱验证码" v-model="email_code" />
      <click-button class="but" @click="send_email">
        <p>发送验证码</p>
      </click-button>
    </div>
    <click-button class="but" @click="reset_email">
      <p>确定修改</p>
    </click-button>
  </div>
  <div class="center">
    <click-button class="but" @click="logout">
      <p>退出登录</p>
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
