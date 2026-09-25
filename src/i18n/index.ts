import { zhHans } from './locales/zh-Hans'
import { en } from './locales/en'

export type MessageKey = keyof typeof zhHans
type Catalog = typeof zhHans

/** 基准语言。系统语言不在支持列表里时回落到它。 */
export const BASE_LOCALE = 'zh-Hans'

const catalogs: Record<string, Catalog> = { 'zh-Hans': zhHans, en }

/** 目录名大小写归一后的查表，用于把 BCP-47 标签降级匹配到目录。 */
const byTag: Record<string, Catalog> = Object.fromEntries(
  Object.entries(catalogs).map(([tag, catalog]) => [tag.toLowerCase(), catalog]),
)

let current: Catalog = zhHans
let currentTag: string = BASE_LOCALE

/** 语言变化订阅者。语言是模块级状态，不通知的话界面切了语言不重绘。 */
const listeners = new Set<() => void>()

/**
 * BCP-47 标签逐级降级成我们支持的目录。
 * `zh-Hans-CN` → `zh-Hans`；`en-US` → `en`；`zh-CN` → 基准（简体）。
 */
export function resolveTag(tag: string): string {
  const parts = tag.replace(/_/g, '-').split('-').filter(Boolean)
  for (let n = parts.length; n > 0; n--) {
    const hit = byTag[parts.slice(0, n).join('-').toLowerCase()]
    if (hit) return parts.slice(0, n).join('-')
  }
  return BASE_LOCALE
}

/** 切换语言。标签可以是宿主给的 BCP-47，也可以是浏览器给的。 */
export function setLocale(tag: string): void {
  const resolved = resolveTag(tag)
  currentTag = resolved
  current = catalogs[resolved] ?? zhHans
  document.documentElement.lang = resolved
  document.title = current['app.title']
  for (const notify of listeners) notify()
}

/** 订阅语言变化，配合 `useSyncExternalStore` 使用（见 useLocale.ts）。 */
export function subscribeLocale(notify: () => void): () => void {
  listeners.add(notify)
  return () => {
    listeners.delete(notify)
  }
}

/** 当前语言标签（已规范化），交给 Intl 用。 */
export function getLocale(): string {
  return currentTag
}

/**
 * 取文案。
 *
 * 不用 i18n 库的原因：主流库的键是 string，拼错只在运行时发现（界面显示成 `chat.plaeholder`）。
 * 这里键的类型来自基准目录，拼错编译不过。
 */
export function t(key: MessageKey, params?: Record<string, string | number>): string {
  const template: string = current[key]
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    name in params ? String(params[name]) : placeholder,
  )
}
