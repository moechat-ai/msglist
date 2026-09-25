import { SELF_ID, lastMessage, type Conversation, type Message, type Participant } from '../model/types'

/**
 * 演示数据。
 *
 * 消息内容和联系人姓名是**数据**，不是界面文案——真实产品里它们来自服务端，
 * 不进 i18n 目录。但演示数据要按语言给：否则英文界面里混着中文假消息，看不出效果。
 *
 * 接入服务端后整份文件删掉，其余代码不动。
 */

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

interface RawMessage {
  /** `'me'` = 自己发的；数字 = `members` 的下标 */
  from: 'me' | number
  kind?: 'text' | 'image'
  text: string
  /** 距当前时刻多久，用来生成相对时间戳 */
  ago: number
}

interface RawConversation {
  /** 群名。单人会话不填，标题取对方姓名 */
  name?: string
  /** 对端，不含自己。1 个 = 单聊，≥2 = 群聊 */
  members: string[]
  unread: number
  messages: RawMessage[]
}

const zhHans: RawConversation[] = [
  {
    name: '周末爬山',
    members: ['周野', '许清', '沈叙'],
    unread: 2,
    messages: [
      { from: 0, text: '周六几点集合', ago: 5 * HOUR },
      { from: 1, text: '七点，老地方', ago: 4 * HOUR + 40 * MINUTE },
      { from: 2, text: '我带水', ago: 4 * HOUR },
      { from: 'me', text: '我负责喊人', ago: 4 * HOUR - 5 * MINUTE },
    ],
  },
  {
    members: ['林晚'],
    unread: 0,
    messages: [
      { from: 'me', text: '那个展你去了吗', ago: 3 * DAY + 2 * HOUR },
      { from: 0, text: '去了，人比画多', ago: 3 * DAY + HOUR },
      { from: 0, text: '照片回头发你', ago: 3 * DAY },
      { from: 'me', text: '好', ago: 2 * DAY },
      { from: 0, kind: 'image', text: '', ago: 26 * HOUR },
      { from: 0, text: '就这一张能看', ago: 26 * HOUR - 3 * MINUTE },
      { from: 'me', text: '还行啊', ago: 25 * HOUR },
    ],
  },
  {
    members: ['陈叙'],
    unread: 0,
    messages: [
      { from: 'me', text: '文件收到了', ago: 2 * DAY + 10 * MINUTE },
      { from: 0, text: '第三页那个数我改了，你看下', ago: 2 * DAY - 30 * MINUTE },
      { from: 'me', text: '看到了，其余没问题', ago: 2 * DAY - 40 * MINUTE },
    ],
  },
  {
    name: '读书会',
    members: ['江以', '陆时'],
    unread: 3,
    messages: [
      { from: 1, text: '这周读第五章', ago: 6 * DAY },
      { from: 0, text: '收到', ago: 6 * DAY - HOUR },
      { from: 'me', text: '我请假，出差', ago: 5 * DAY },
      { from: 1, text: '行', ago: 5 * DAY - HOUR },
    ],
  },
]

const en: RawConversation[] = [
  {
    name: 'Weekend hike',
    members: ['Ari', 'Bea', 'Cal'],
    unread: 2,
    messages: [
      { from: 0, text: 'What time on Saturday?', ago: 5 * HOUR },
      { from: 1, text: 'Seven, usual spot', ago: 4 * HOUR + 40 * MINUTE },
      { from: 2, text: "I'll bring water", ago: 4 * HOUR },
      { from: 'me', text: "I'll round everyone up", ago: 4 * HOUR - 5 * MINUTE },
    ],
  },
  {
    members: ['Lena'],
    unread: 0,
    messages: [
      { from: 'me', text: 'Did you make it to the show?', ago: 3 * DAY + 2 * HOUR },
      { from: 0, text: 'Yes. More people than paintings.', ago: 3 * DAY + HOUR },
      { from: 0, text: "I'll send photos later", ago: 3 * DAY },
      { from: 'me', text: 'Sure', ago: 2 * DAY },
      { from: 0, kind: 'image', text: '', ago: 26 * HOUR },
      { from: 0, text: 'Only this one is any good', ago: 26 * HOUR - 3 * MINUTE },
      { from: 'me', text: "It's fine, honestly", ago: 25 * HOUR },
    ],
  },
  {
    members: ['Marcus'],
    unread: 0,
    messages: [
      { from: 'me', text: 'Got the file', ago: 2 * DAY + 10 * MINUTE },
      { from: 0, text: 'Changed the number on page 3 — take a look', ago: 2 * DAY - 30 * MINUTE },
      { from: 'me', text: 'Saw it. Rest looks fine', ago: 2 * DAY - 40 * MINUTE },
    ],
  },
  {
    name: 'Book club',
    members: ['Dana', 'Eli'],
    unread: 3,
    messages: [
      { from: 1, text: 'Chapter five this week', ago: 6 * DAY },
      { from: 0, text: 'Got it', ago: 6 * DAY - HOUR },
      { from: 'me', text: "I'll skip — travelling", ago: 5 * DAY },
      { from: 1, text: 'Fair', ago: 5 * DAY - HOUR },
    ],
  },
]

const seeds: Record<string, RawConversation[]> = { 'zh-Hans': zhHans, en }

/** 头像色相由 id 稳定派生，保证同一个人在任何位置颜色一致。 */
function hueOf(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360
  return h
}

/** 越界的 from 说明演示数据写错了。崩掉，不要悄悄变成「自己发的」。 */
function senderOf(from: 'me' | number, participants: Participant[]): string {
  if (from === 'me') return SELF_ID
  const participant = participants[from]
  if (participant === undefined) {
    throw new Error(`演示数据错误：from=${from} 越界，该会话只有 ${participants.length} 个对端`)
  }
  return participant.id
}

function build(seed: RawConversation[], now: number): Conversation[] {
  return seed
    .map((raw, ci) => {
      const participants: Participant[] = raw.members.map((name, pi) => {
        const id = `p${ci}-${pi}`
        return { id, name, hue: hueOf(id) }
      })
      const messages: Message[] = raw.messages
        .map((m, mi) => ({
          id: `m${ci}-${mi}`,
          senderId: senderOf(m.from, participants),
          kind: m.kind ?? ('text' as const),
          text: m.text,
          at: now - m.ago,
        }))
        .sort((a, b) => a.at - b.at)
      return { id: `c${ci}`, name: raw.name, participants, messages, unread: raw.unread }
    })
    .sort((a, b) => (lastMessage(b)?.at ?? 0) - (lastMessage(a)?.at ?? 0))
}

export function loadConversations(locale: string, now: number = Date.now()): Conversation[] {
  const seed = seeds[locale]
  if (seed === undefined) {
    throw new Error(`没有 ${locale} 的演示数据。可用：${Object.keys(seeds).join(', ')}`)
  }
  return build(seed, now)
}
