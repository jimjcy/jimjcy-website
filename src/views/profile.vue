<script setup>
import constant from "../constant";

const router = useRouter();
const LOGOUTSESSIONID = "00000000000000000000000000000000";

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
  localStorage.sessionid = LOGOUTSESSIONID;
  window.location.href = "/login";
}
</script>

<template>
  <div class="form">
    <h1 v-text="text"></h1>
    <div class="block">
      <h2>基础信息</h2>
      <h3>用户名</h3>
      <div class="input_box">
        <p>用户名：</p>
        <input type="text" v-model="username" placeholder="用户名" />
      </div>
      <div class="input_box">
        <p>验证码：</p>
        <input type="text" placeholder="验证码" v-model="code" maxlength="4" />
        <img :src="image" @click="imageReload" alt="验证码" />
      </div>
      <input type="submit" value="确定修改" @click="reset_username" />
      <br />
      <!--*************************************************-->
      <h3>性别</h3>
      <div class="input_box">
        <p>性别：</p>
        <select v-model="sex">
          <option value="保密" selected>保密</option>
          <option value="男">男</option>
          <option value="女">女</option>
          <option value="未知">未知</option>
        </select>
      </div>
      <div class="input_box">
        <p>验证码：</p>
        <input type="text" placeholder="验证码" v-model="code" maxlength="4" />
        <img :src="image" @click="imageReload" alt="验证码" />
      </div>
      <input type="submit" value="确定修改" @click="reset_sex" />
    </div>
    <h4 class="error" v-text="error"></h4>
    <!--***********************************************-->
    <div class="block">
      <h2>其它设置</h2>
      <div>
        <h3>密码设置</h3>
        <div class="input_box">
          <p>原密码：</p>
          <input
            type="password"
            placeholder="原密码"
            v-model="password_before"
          />
        </div>
        <div class="input_box">
          <p>新密码：</p>
          <input type="password" placeholder="新密码" v-model="password_new" />
        </div>
        <div class="input_box">
          <p>验证码：</p>
          <input
            type="text"
            placeholder="验证码"
            v-model="code"
            maxlength="4"
          />
          <img :src="image" @click="imageReload" alt="验证码" />
        </div>
        <input type="submit" value="确定修改" @click="reset_password" />
      </div>
      <br /><!--**********************************************-->
      <div>
        <h3>邮箱设置</h3>
        <div class="input_box">
          <p>修改的邮箱：</p>
          <input type="text" placeholder="修改的邮箱" v-model="email" />
        </div>
        <div class="input_box">
          <p>验证码：</p>
          <input
            type="text"
            placeholder="验证码"
            v-model="code"
            maxlength="4"
          />
          <img :src="image" @click="imageReload" alt="验证码" />
        </div>
        <div class="input_box">
          <p>邮箱验证码：</p>
          <input
            type="text"
            placeholder="邮箱验证码"
            v-model="email_code"
            maxlength="5"
          />
          <input
            type="submit"
            value="发送验证码"
            @click="send_email"
            ref="email_code_button"
          />
        </div>
        <input type="submit" value="确定修改" @click="reset_email" />
      </div>
    </div>
    <!--**************************************************************-->
    <input type="button" value="退出登录" class="logout" @click="logout" />
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
      background-color: #f29c50;
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
    background-color: #f29c50;
    margin-top: 5px;
    margin-bottom: 5px;

    &:hover {
      background-color: #f29c50;
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

  select {
    font-size: medium;
    border: none;
    outline: none;
    width: 250px;
    height: 30px;
    background-color: yellowgreen;
    margin-top: 5px;

    option {
      font-size: medium;
      border: none;
      outline: none;
      width: 250px;
      height: 30px;
      background-color: yellowgreen;
      margin-top: 5px;
    }
  }
}

.logout {
  margin-top: 30px;
  border: none;
  background-color: #f29c50;
  border-radius: 90px;
  color: white;
  width: 99%;
  height: 60px;
  text-align: center;
  font-size: 30px;
}

.error {
  background-color: red;
  font-size: small;
  text-align: center;
}
</style>
