<script setup>
import constant from "../constant";

const username = ref("");
const password = ref("");
const code = ref("");
const error = ref("");
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

function submit_button() {
  error.value = "";
  if (username.value === "" || password.value === "" || code.value === "") {
    error.value = "请输入完整的表单";
  } else {
    constant.req
      .post("/login", {
        username: username.value,
        password: password.value,
        code: code.value,
        codesession: localStorage.codesession,
      })
      .then((response) => {
        if (response.data.status) {
          localStorage.sessionid = response.data.sessionid;
          window.location.href = localStorage.fromUrl;
        } else {
          error.value = response.data.errorMessage;
        }
      });
  }
}
</script>

<template>
  <h1 class="title">登录</h1>
  <div class="block form">
    <div class="input_box">
      <p>用户名或邮箱：</p>
      <input type="text" placeholder="用户名或邮箱" v-model="username" />
    </div>
    <div class="input_box">
      <p>密码：</p>
      <input type="password" placeholder="密码" v-model="password" />
    </div>
    <div class="input_box">
      <p>验证码：</p>
      <input type="text" placeholder="验证码" maxlength="4" v-model="code" />
      <img alt="验证码" @click="imageReload" :src="image" />
    </div>
    <p class="error" v-text="error"></p>
    <p>
      没有账号？<RouterLink class="links" to="/register">去注册</RouterLink>
      忘记密码？<RouterLink class="links" to="/forget_password"
        >去找回</RouterLink
      >
    </p>
    <input
      type="submit"
      value="登录"
      @click="submit_button"
      @keyup.enter="submit_button"
    />
  </div>
</template>

<style lang="scss" scoped>
.title {
  text-align: center;
  color: white;
  margin-top: 15px;
}

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
}

.error {
  background-color: red;
  font-size: small;
  text-align: center;
}
</style>
