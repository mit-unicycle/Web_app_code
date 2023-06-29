import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import bootstrapVue from "bootstrap-vue-next";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App)
app.use(router)
app.use(bootstrapVue)
app.mount('#app')