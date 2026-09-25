/** 自己。消息的 senderId 等于它就是「我发的」。 */
export const SELF_ID = 'me'

export type MessageKind = 'text' | 'image'

export interface Message {
  id: string
  senderId: string
  kind: MessageKind
  /** kind 为 image 时为空字符串，界面按 chat.image 渲染占位 */
  text: string
  /** epoch 毫秒。展示一律走 Intl，不手工拼字符串 */
  at: number
}

export interface Participant {
  id: string
  name: string
  /** 头像色相 0–360，由 id 决定，保证同一个人各处颜色一致 */
  hue: number
}

export interface Conversation {
  id: string
  /** 群名。空/缺省时标题回落到成员名拼接（见 lib/title.ts） */
  name?: string | undefined
  /** 对端，**不含自己**。长度 1 = 单人，≥2 = 群聊 */
  participants: Participant[]
  messages: Message[]
  unread: number
}

export type ChatKind = 'direct' | 'group'

export function chatKind(conversation: Conversation): ChatKind {
  return conversation.participants.length > 1 ? 'group' : 'direct'
}

export function lastMessage(conversation: Conversation): Message | undefined {
  return conversation.messages[conversation.messages.length - 1]
}

export function findParticipant(conversation: Conversation, id: string): Participant | undefined {
  return conversation.participants.find((p) => p.id === id)
}
