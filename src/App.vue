<script lang="ts" setup>
import utils from "@/common/utils";
import navbar from "./component/bar/navbar.vue";
import windowInfo from "./component/window/windowInfo.vue";
import { showNavbar, showThemeWindow } from "./common/publicRefs.ts";
import { changeTheme } from "@/common/theme.ts";

const router = useRouter();
router.beforeEach(async (to, from) => {
  document.title = to.meta.title + "-小井井的网站";
});

const themeWindow = useTemplateRef("themeWindow");
function openThemeWindow() {
  if (themeWindow.value) {
    themeWindow.value.open();
  }
}
function closeThemeWindow() {
  showThemeWindow.value = false;
}
watchEffect(() => {
  if (showThemeWindow.value) openThemeWindow();
});
changeTheme(localStorage.theme);
</script>
<template>
  <navbar class="bar" :show-navbar="showNavbar" />
  <window-info
    title="主题选择"
    ref="themeWindow"
    :height="500"
    :width="500"
    @closeWindow="closeThemeWindow"
  >
    <div class="selection">
      <click-button
        v-for="color in utils.theme"
        class="themeButton"
        @click="changeTheme(color.name)"
      >
        <div class="theme-box">
          <div class="color" :style="{ backgroundColor: color.color }"></div>
          <p v-text="color.display" class="name"></p>
        </div>
      </click-button>
    </div>
  </window-info>
  <div class="pages">
    <router-view></router-view>
  </div>
</template>
<style lang="scss" scoped>
@use "@/styles/themes.scss" as *;
.pages {
  width: 100%;
  height: 100%;
  // padding-top: 5em;
  // overflow-y: scroll;
}
// .bar {
//   opacity: 0.5;
// }
.selection {
  display: flex;
  flex-wrap: wrap;

  .themeButton {
    flex: 1;
    width: 5em;
    height: 8em;
    font-size: 1.2em;
    margin: 10px;
    padding: 5px;
    .theme-box {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .color {
        width: 2em;
        height: 2em;
        border-radius: 0.6em;
        @include useTheme {
          border: 2px solid getTheme(border-color);
        }
      }
      .name {
        @include useTheme {
          color: getTheme(text-color);
        }
      }
    }
  }
}
</style>
