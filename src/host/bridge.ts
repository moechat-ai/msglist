/**
 * 子应用侧**唯一**的宿主适配层。
 *
 * 宿主向子应用注入 `window.moechat`（读），子应用用 `window.moechatHost.post`（写）。
 * 协议定义见《宿主设计实现方案》第七章。所有窗口宿主相关的判断只出现在这个文件里。
 */

export interface HostContext {
  subjectId: string
  subjectName: string
  spacetime: string
  theme: string
  /** BCP-47，宿主系统语言，如 `zh-Hans-CN` */
  locale: string
}

declare global {
  interface Window {
    moechat?: Partial<HostContext>
    moechatHost?: { post(type: string, payload?: unknown): void }
  }
}

/**
 * 桥未接入时（直接开浏览器调试）的兜底语言。
 * `?locale=en` 优先，方便在本机同时验两套语言。
 */
function fallbackLocale(): string {
  const override = new URLSearchParams(location.search).get('locale')
  return override ?? navigator.language
}

/** 读宿主上下文。未接入宿主时返回安全兜底值，页面不报错、不白屏。 */
export function readHostContext(): HostContext {
  const injected = window.moechat
  return {
    subjectId: injected?.subjectId ?? '',
    subjectName: injected?.subjectName ?? '',
    spacetime: injected?.spacetime ?? '',
    theme: injected?.theme ?? 'dark',
    locale: injected?.locale ?? fallbackLocale(),
  }
}

/** 向宿主发消息。桥不存在时静默丢弃——宿主本来就可能没有这个能力。 */
export function postToHost(type: string, payload?: unknown): void {
  window.moechatHost?.post(type, payload)
}
