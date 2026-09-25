import type { zhHans } from './zh-Hans'

/**
 * 英文目录。
 *
 * 类型标成 `typeof zhHans` —— 少一个键就编译不过，多一个键也编译不过。
 * 新增语言照抄这一行即可。
 */
export const en: typeof zhHans = {
  'app.title': 'Messages',

  'list.empty': 'No conversations yet',
  'list.members': '{n} members',
  'list.nameSeparator': ', ',
  'list.ownPrefix': 'You: ',

  'chat.back': 'Back',
  'chat.placeholder': 'Type a message…',
  'chat.send': 'Send',
  'chat.image': '[Image]',
  'chat.day.today': 'Today',
  'chat.day.yesterday': 'Yesterday',
}
