import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { readHostContext } from './host/bridge'
import { setLocale } from './i18n'
import './styles/tokens.css'
import './styles/app.css'

const container = document.getElementById('root')
if (container === null) {
  throw new Error('index.html 缺少 #root')
}

// 渲染前先定语言，避免首帧闪一次错误语言。
// 宿主未注入时 readHostContext 会回落到浏览器语言。
setLocale(readHostContext().locale)

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
