import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import buttonComponent from './component/buttonComponent.vue'
import windowInfo from './component/windowInfo.vue'
import dataInput from './component/dataInput.vue'

const app = createApp(App)
app.use(router)
app.component('center-button', buttonComponent)
app.component('window-info', windowInfo)
app.component('data-input', dataInput)
app.mount('#app')
