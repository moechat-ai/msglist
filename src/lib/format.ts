import { getLocale, t } from '../i18n'

/**
 * 时间展示一律走 Intl，**禁止手工拼** `MM-DD` 或 `13:07`。
 * 手工拼接会把「月/日顺序」「12/24 小时制」「上午/AM」这些差异硬编码进代码里。
 */

const DAY = 86_400_000
const formatters = new Map<string, Intl.DateTimeFormat>()

function formatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const locale = getLocale()
  const key = `${locale}|${JSON.stringify(options)}`
  let found = formatters.get(key)
  if (!found) {
    found = new Intl.DateTimeFormat(locale, options)
    formatters.set(key, found)
  }
  return found
}

/** 本地时区当天零点。跨夏令时的天数差用四舍五入抹平 23/25 小时的误差。 */
function startOfDay(at: number): number {
  const d = new Date(at)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function daysAgo(at: number, now: number): number {
  return Math.round((startOfDay(now) - startOfDay(at)) / DAY)
}

export function sameDay(a: number, b: number): boolean {
  return startOfDay(a) === startOfDay(b)
}

export function formatTime(at: number): string {
  return formatter({ hour: '2-digit', minute: '2-digit' }).format(at)
}

/** 会话列表右上角的时间：今天给时刻，昨天给「昨天」，更早给日期。 */
export function formatListTime(at: number, now: number): string {
  const days = daysAgo(at, now)
  if (days <= 0) return formatTime(at)
  if (days === 1) return t('chat.day.yesterday')
  return formatter({ month: 'short', day: 'numeric' }).format(at)
}

/** 聊天流里的日期分隔条。 */
export function formatDayLabel(at: number, now: number): string {
  const days = daysAgo(at, now)
  if (days <= 0) return t('chat.day.today')
  if (days === 1) return t('chat.day.yesterday')
  return formatter({ year: 'numeric', month: 'short', day: 'numeric' }).format(at)
}
