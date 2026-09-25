import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 宿主的 origin 各端不同（Android 是 https://appassets.androidplatform.net，
  // macOS 是 moechat-app://），子应用不能假设 origin，产物必须是相对路径。
  base: './',
  build: {
    // 宿主从本地目录加载，不需要 sourcemap 随包分发
    sourcemap: false,
  },
})
