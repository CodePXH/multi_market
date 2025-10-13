import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import router from './router'
import currency from "currency.js";

function isEmpty (data) {
    let empty = false
    const type = typeof data
    const excludeList = ['number', 'boolean']
    if (data) {
        if (type === 'object') {
            empty = Object.keys(data).length === 0
        }
    } else if (excludeList.indexOf(type) === -1) {
        empty = true
    }
    return empty
}

// 货币格式化函数
const currencyFilter = (value, scale = 3) => {
    const noValue = isEmpty(value)
    if (isNaN(value) || noValue) {
        return '--'
    }
    return currency(value, {precision: scale,symbol: ''}).format()
}
const app = createApp(App)

// 添加全局属性
app.config.globalProperties.$currency = currencyFilter

app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
