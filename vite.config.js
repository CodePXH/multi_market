import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 8000,
    host: true,
    open: true,
    proxy: {
      // 代理所有以/api开头的请求到目标服务器
      '/api': {
        target: 'http://192.168.10.171:8099', // 后端服务IP和端口
        changeOrigin: true
      }
    }
  }
})
