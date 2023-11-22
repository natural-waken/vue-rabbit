
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 引入初始化样式文件
import '@/styles/common.scss'



// 引入懒加载指令插件并且注册
import { lazyPlugin } from './directives'

// 引入全局组件插件
import { componentPlugin } from '@/components'


const app = createApp(App)

app.use(router)

// pinia 持久化插件引入
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

app.use(pinia)
pinia.use(piniaPluginPersistedstate)

app.use(lazyPlugin)
// 这个方法执行   那么指令中  install   方法就被执行

app.use(componentPlugin)

app.mount('#app')


























