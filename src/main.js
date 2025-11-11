import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import clickButton from './component/input/clickButton.vue'
import windowInfo from './component/window/windowInfo.vue'
import textLine from './component/input/text-line.vue'
import textArea from './component/input/text-area.vue'
import selectItem from './component/input/select-item.vue'

const app = createApp(App)
app.use(router)
app.component('click-button', clickButton)
app.component('window-info', windowInfo)
app.component('text-line', textLine)
app.component('text-area', textArea)
app.component('select-item', selectItem)
app.mount('#app')
