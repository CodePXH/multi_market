import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import importToCDN from 'vite-plugin-cdn-import' // 新增CDN引入插件

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vueDevTools(),
    // CDN引入第三方库（按需配置）
    importToCDN({
      modules: [
        {
          name: 'vue',
          var: 'Vue',
          path: 'https://cdn.jsdelivr.net/npm/vue@3.4.21/dist/vue.global.prod.js'
        },
        {
          name: 'element-plus',
          var: 'ElementPlus',
          path: 'https://cdn.jsdelivr.net/npm/element-plus@2.7.3/dist/index.full.min.js',
          css: 'https://cdn.jsdelivr.net/npm/element-plus@2.7.3/dist/index.css'
        }
      ]
    }),
  ],
  build: {
    outDir: 'dist', // 默认输出目录
    assetsDir: 'static', // 静态资源目录
    sourcemap: false, // 关闭sourcemap
    minify: 'terser', // 代码压缩工具
    chunkSizeWarningLimit: 1500, // 块大小警告阈值
    rollupOptions: {
      output: {
        manualChunks: {
          // 拆分第三方库
          vue: ['vue', 'vue-router'],
          echarts: ['echarts'],
          element: ['element-plus']
        }
      }
    }
  },
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
        target: 'http://192.168.10.171:3080', // 后端服务IP和端口
        changeOrigin: true
      }
    }
  }
})
