import '@/index.scss';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import clickButton from './common/component/clickButton.vue';
import windowInfo from './common/component/windowInfo.vue';
import textLine from './common/component/textLine.vue';
import textArea from './common/component/textArea.vue';
import selectItem from './common/component/selectItem.vue';
import showIcon from './common/component/showIcon.vue';
import slide from './common/command/slide.js';

const app = createApp(App);
app.use(router);
app.component('click-button', clickButton);
app.component('window-info', windowInfo);
app.component('text-line', textLine);
app.component('text-area', textArea);
app.component('select-item', selectItem);
app.component('show-icon', showIcon);
app.directive('slide', slide);
app.mount('#app');

//TODO: add background (animation)
//TODO: colors mixing
//TODO: improve contact information
