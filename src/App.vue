<script lang="ts" setup>
import utils from '@/common/utils/utils.ts';
import navbar from './common/component/navbar.vue';
import windowInfo from './common/component/windowInfo.vue';
import { showNavbar, showThemeWindow } from './common/publicRefs.ts';
import { changeTheme } from '@/common/theme.ts';

const fullscreen = ref<boolean>(false);

const router = useRouter();
router.beforeEach(async (to, from) => {
  if (to === from) return;
  document.title = to.meta.title + '-小井井的网站';
  fullscreen.value = to.meta.fullscreen || false;
});

const themeWindow = useTemplateRef('themeWindow');
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

if (localStorage.version === undefined || localStorage.version !== '3.0.4') {
  localStorage.clear();
  localStorage.version = '3.0.4';
}

if (localStorage.codesession === undefined) {
  utils.req.post('/generate_token').then((response) => {
    localStorage.codesession = response.data;
  });
}
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
    <router-view :class="{ fullscreen: fullscreen }"></router-view>
  </div>
</template>
<style lang="scss" scoped>
@use '@/styles/themes.scss' as *;
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

.pages {
  .page {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
  }
  .fullscreen {
    padding: 5em 0 0 0;
  }
}
</style>
