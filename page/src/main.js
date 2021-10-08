import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import * as Api from "./api"

createApp(App)
    .use(router)
    .provide('api', Api)
    .mount('#app')
