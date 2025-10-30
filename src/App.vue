<script setup>
import constant from "./constant";

const LOGOUTSESSIONID = "00000000000000000000000000000000";

const fold = ref("fold");
const barcontent = ref("菜单");

const welcome = ref("欢迎来到小井井的网站！");
const isLogin = ref(false);
// const isThemeWindowOpen = ref(false);
const username = ref("");
const themeWindow = ref();
const err = ref();

const titles = {
  home: "主页",
  help_documents: "帮助文档",
  information: "网站资讯",
  report_issues: "报告问题",
  download_files: "下载资源",
  chatting_room: "聊天室",
  ai_chatting: "ai聊天",
  login: "登录",
  register: "注册",
  profile: "个人中心",
  about: "联系方式",
};

const routes = {
  "/": "主页",
  help_documents: "帮助文档",
  information: "网站资讯",
  report_issues: "报告问题",
  download_files: "下载资源",
  chatting_room: "聊天室",
  ai_chatting: "ai聊天",
  about: "联系方式",
};

const theme = [
  { name: "light", display: "浅色主题", color: "" },
  { name: "dark", display: "深色主题", color: "" },
  { name: "orange", display: "橙色主题", color: "" },
  { name: "cyan", display: "青绿色主题", color: "" },
  { name: "purple", display: "紫色主题", color: "" },
];

let fromUrl = "";
let toUrl = "";

const router = useRouter();
router.beforeEach(async (to, from) => {
  fromUrl = from.fullPath.split("/")[1];
  toUrl = to.fullPath.split("/")[1];
  if (toUrl === "") {
    toUrl = "home";
  }
  if (fromUrl === "") {
    fromUrl = "home";
  }
  console.log(fromUrl, toUrl);
  document.title = titles[toUrl] + "-小井井的网站";
  if (from.fullPath !== "login") localStorage.fromUrl = from.fullPath;
  else localStorage.fromUrl = to.fullPath;
  if (
    (toUrl === "report_issues" ||
      toUrl === "chatting_room" ||
      toUrl === "ai_chatting") &&
    !isLogin.value
  ) {
    router.push("/login");
    localStorage.fromUrl = to.fullPath;
  }
});

if (localStorage.sessionid === undefined) {
  localStorage.sessionid = LOGOUTSESSIONID;
}

constant.req
  .post("/login/check", {
    sessionid: localStorage.sessionid,
  })
  .then((response) => {
    if (response.data.status) {
      isLogin.value = true;
      username.value = response.data.username;
      welcome.value = "欢迎" + response.data.username + "来到小井井的网站！";
    } else {
      localStorage.sessionid = LOGOUTSESSIONID;
    }
  });

if (localStorage.version === undefined || localStorage.version !== "2.1.0") {
  localStorage.clear();
  localStorage.version = "2.1.0";
}

if (localStorage.codesession === undefined) {
  constant.req.post("/generate_token").then((response) => {
    localStorage.codesession = response.data;
  });
}

function changeTheme(color) {
  document.documentElement.dataset.theme = color;
  localStorage.theme = color;
}
if (localStorage.theme === undefined) {
  localStorage.theme = "light";
}
changeTheme(localStorage.theme);

function openThemeWindow() {
  themeWindow.value.open();
}
</script>

<template>
  <header class="navbar">
    <click-button
      class="but"
      @click="fold = fold === 'fold' ? 'unfold' : 'fold'"
    >
      <p>菜单</p>
    </click-button>
    <p v-text="welcome" class="welcome"></p>
    <click-button
      class="but"
      @click="openThemeWindow"
      style="margin-right: 20px"
    >
      <p>主题</p>
    </click-button>
    <click-button class="but" style="margin-right: 20px"
      ><p>新闻</p></click-button
    >
    <click-button @click="router.push('/login')" class="but" v-if="!isLogin"
      ><p>登录</p></click-button
    >
    <click-button @click="router.push('/profile')" class="link" v-if="isLogin">
      {{ username }}
    </click-button>
  </header>
  <div class="content">
    <div class="sidebar" :class="fold">
      <click-button
        class="but"
        v-for="(value, key) in routes"
        :key="key"
        @click="router.push(key)"
      >
        <!-- <RouterLink :to="key">{{ value }}</RouterLink> -->
        <p>{{ value }}</p>
      </click-button>
      <click-button class="but" v-if="!isLogin" @click="router.push('/login')">
        <!-- <RouterLink to="/login">登录</RouterLink> -->
        <p>登录</p>
      </click-button>
      <click-button
        class="but"
        v-if="!isLogin"
        @click="router.push('/register')"
      >
        <!-- <RouterLink to="/register">注册</RouterLink> -->
        <p>注册</p>
      </click-button>
      <click-button
        class="but"
        v-if="isLogin"
        @click="router.push('/profile')"
      >
        <!-- <RouterLink to="/profile">个人中心</RouterLink>F -->
        <p>个人中心</p>
      </click-button>
      <img
        src="./assets/pic.jpg"
        alt="小井井的头像"
        style="height: 7em; width: 100%"
      />
      <div class="footer">
        <p>Copyright © 2025 小井井的网站 jimjcy.top All Rights Reserved.</p>
        <div class="links">
          <a href="https://beian.miit.gov.cn/" target="_blank"
            >赣ICP备2024027845号-1</a
          >
          <a
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=36070202001004"
            target="_blank"
            >赣公网安备 36070202001004号</a
          >
        </div>
        <p>
          Powered by Vue+Vite+VueRouter Designed by Xiaojingjing &
          <a target="_blank" href="https://github.com/grassblock123"
            >grassblock</a
          >
        </p>
        <p>
          友情链接：<a target="_blank" href="https://kuankuan.site"
            >宽宽的小天地</a
          >
          <a target="_blank" href="https://python666.cn">crossin的个人博客</a>
          <a target="_blank" href="http://bsynet.cc">思远的网站</a>
          <a target="_blank" href="http://hezi.xyxpz.cn">鹤子的网站</a>
          <a target="_blank" href="https://neongel.github.io"
            >小皮鸭(neongel工作室)的网站</a
          >
        </p>
        <!-- <br /><br /><br /><br /> -->
      </div>
    </div>
    <div class="page">
      <RouterView />
    </div>
  </div>
  <window-info
    @close="themeWindow.value.close()"
    title="主题选择"
    ref="themeWindow"
  >
    <div class="selection">
      <button
        v-for="color in theme"
        class="themeButton"
        @click="changeTheme(color.name)"
      >
        {{ color.display }}
      </button>
    </div>
  </window-info>
</template>

<style lang="scss" scoped>
@use "./styles/themes.scss" as *;

.navbar {
  display: flex;
  position: sticky;
  height: 5em;
  top: 0;
  align-items: center;
  border: solid 2px;
  z-index: 2;
  @include useTheme {
    background-color: getTheme(background-color);
    border-color: getTheme(border-color);
  }

  .welcome {
    margin: auto;
    text-align: center;
    font-size: 1.7em;
    @include useTheme {
      color: getTheme(text-color);
    }
  }

  .but {
    font-size: 1.3em;
    height: calc(100% - 5px);
    width: 4em;
  }
}

.content {
  height: calc(100% - 5em - 4px);
  position: relative;
  @include useTheme {
    background-color: getTheme(page-color);
  }
  .sidebar {
    position: absolute;
    top: 0;
    max-height: calc(100% - 4px);
    height: calc(100% - 4px);
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: none;
    transition: all 0.35s ease-out;
    border: solid 2px;
    z-index: 2;
    @include useTheme {
      background-color: getTheme(background-color);
      border-color: getTheme(border-color);
    }
    .but {
      margin: .5em .5em;
      height: 2.3em;
      border-radius: 1.2em;
      border-width: 0.15em;
      width: calc(100% - 1em);
      font-size: 1.4em;
    }
    .footer {
      width: 100%;
      @include useTheme {
        background-color: getTheme(background-color);
      }

      p {
        @include useTheme {
          color: getTheme(text-color);
        }
        margin-bottom: 0;
      }

      a {
        @include useTheme {
          color: getTheme(text-color);
          &:hover {
            color: getTheme(hover-color);
          }
        }
        padding-left: 5px;
        padding-right: 5px;
      }
    }
  }

  .page {
    z-index: 1;
    max-height: calc(100% - 4px);
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}

.fold {
  width: 0px;
}

.unfold {
  width: 12em;
}

.selection {
  display: flex;
}
</style>
