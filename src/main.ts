import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import clickButton from './common/component/input/clickButton.vue';
import windowInfo from './common/component/window/windowInfo.vue';
import textLine from './common/component/input/text-line.vue';
import textArea from './common/component/input/text-area.vue';
import selectItem from './common/component/input/select-item.vue';
import slide from './common/vComands/slide.js';

const app = createApp(App);
app.use(router);
app.component('click-button', clickButton);
app.component('window-info', windowInfo);
app.component('text-line', textLine);
app.component('text-area', textArea);
app.component('select-item', selectItem);
app.directive('slide', slide);
app.mount('#app');
