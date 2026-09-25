import { t } from '../i18n'
import type { Conversation } from '../model/types'

/**
 * 会话标题。属于展示层，所以放在 lib 而不是 model —— model 不依赖 i18n。
 *
 * 拼接用的顿号/逗号是语言相关的，走目录，不写字面量。
 */
export function conversationTitle(conversation: Conversation): string {
  if (conversation.name !== undefined && conversation.name !== '') return conversation.name
  return conversation.participants.map((p) => p.name).join(t('list.nameSeparator'))
}
