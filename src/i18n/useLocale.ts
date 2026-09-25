import { useSyncExternalStore } from 'react'
import { getLocale, subscribeLocale } from './index'

/** 订阅当前语言。语言变化时组件自动重绘。 */
export function useLocale(): string {
  return useSyncExternalStore(subscribeLocale, getLocale)
}
