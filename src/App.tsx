import { useCallback, useMemo, useState } from 'react'
import { useLocale } from './i18n/useLocale'
import { loadConversations } from './mock/data'
import { SELF_ID, lastMessage, type Message } from './model/types'
import { Chat } from './views/Chat'
import { ConversationList } from './views/ConversationList'

let localSeq = 0

/**
 * 深链入口：`?conversation=<id>` 直接打开某个会话。
 * 宿主要求「点通知跳到那条会话」时走这里，不必新增宿主协议。
 */
function initialConversationId(): string | null {
  const id = new URLSearchParams(location.search).get('conversation')
  return id === null || id === '' ? null : id
}

/**
 * 两屏之间的导航。
 *
 * 未接路由库：宿主内的子应用只在这两屏之间切换，引入 router 只会多一层
 * history 与宿主 WebView 的历史栈打架（宿主顶栏已有前进/后退）。
 */
export function App() {
  const locale = useLocale()
  const [now] = useState(() => Date.now())
  const [activeId, setActiveId] = useState<string | null>(initialConversationId)
  const [sent, setSent] = useState<Record<string, Message[]>>({})
  const [dismissedUnread, setDismissedUnread] = useState<ReadonlySet<string>>(() => new Set())

  const conversations = useMemo(() => {
    return loadConversations(locale, now)
      .map((conversation) => {
        const extra = sent[conversation.id]
        const unread = dismissedUnread.has(conversation.id) ? 0 : conversation.unread
        if (extra === undefined && unread === conversation.unread) return conversation
        return {
          ...conversation,
          messages: extra === undefined ? conversation.messages : [...conversation.messages, ...extra],
          unread,
        }
      })
      .sort((a, b) => (lastMessage(b)?.at ?? 0) - (lastMessage(a)?.at ?? 0))
  }, [locale, now, sent, dismissedUnread])

  const open = useCallback((id: string) => {
    setActiveId(id)
    setDismissedUnread((prev) => new Set(prev).add(id))
  }, [])

  const send = useCallback((id: string, text: string) => {
    localSeq += 1
    const message: Message = {
      id: `local-${localSeq}`,
      senderId: SELF_ID,
      kind: 'text',
      text,
      at: Date.now(),
    }
    setSent((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), message] }))
  }, [])

  const active = activeId === null ? undefined : conversations.find((c) => c.id === activeId)

  return (
    <div className="app">
      {active === undefined ? (
        <ConversationList conversations={conversations} now={now} onOpen={open} />
      ) : (
        <Chat
          conversation={active}
          now={now}
          onBack={() => setActiveId(null)}
          onSend={(text) => send(active.id, text)}
        />
      )}
    </div>
  )
}
