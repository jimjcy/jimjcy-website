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

function login() {
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
  <div class="block center">
    <text-line title="用户名" width="17" height="2" />
    <text-line title="密码" width="17" height="2" />
    <div class="code">
      <text-line title="验证码" width="17" height="2" />
      <img alt="验证码" @click="imageReload" :src="image" />
    </div>
    <p class="error" v-text="error"></p>
    <p>
      没有账号？<RouterLink class="links" to="/register">去注册</RouterLink>
      忘记密码？<RouterLink class="links" to="/forget_password"
        >去找回</RouterLink
      >
    </p>
    <click-button @click="login" class="but">
      <p>登录</p>
    </click-button>
  </div>
</template>

<style lang="scss" scoped>
.title {
  text-align: center;
}
.but {
  font-size: 1.2em;
  width: 7em;
}
.code {
  display: flex;
  align-items: center;
  img {
    margin-left: 20px;
    height: 50px;
    cursor: pointer;
  }
}
</style>
