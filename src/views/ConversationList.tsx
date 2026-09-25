import { Avatar, firstGrapheme } from '../components/Avatar'
import { t } from '../i18n'
import { formatListTime } from '../lib/format'
import { conversationTitle } from '../lib/title'
import { SELF_ID, chatKind, lastMessage, type Conversation, type Message } from '../model/types'

interface Props {
  conversations: Conversation[]
  now: number
  onOpen: (id: string) => void
}

export function ConversationList({ conversations, now, onOpen }: Props) {
  return (
    <>
      <header className="hdr">
        <h1 className="hdr__title">{t('app.title')}</h1>
      </header>
      <div className="scroller">
        {conversations.length === 0 ? (
          <p className="empty">{t('list.empty')}</p>
        ) : (
          conversations.map((conversation) => (
            <Row key={conversation.id} conversation={conversation} now={now} onOpen={onOpen} />
          ))
        )}
      </div>
    </>
  )
}

/** 附件在列表里只显示占位文案，不渲染图。 */
function previewText(message: Message): string {
  return message.kind === 'image' ? t('chat.image') : message.text
}

/** 单聊取对方颜色；群聊取成员平均色，这样群头像颜色也稳定。 */
function avatarHue(conversation: Conversation): number {
  const hues = conversation.participants.map((p) => p.hue)
  if (hues.length === 0) return 0
  return Math.round(hues.reduce((sum, h) => sum + h, 0) / hues.length)
}

interface RowProps {
  conversation: Conversation
  now: number
  onOpen: (id: string) => void
}

function Row({ conversation, now, onOpen }: RowProps) {
  const last = lastMessage(conversation)
  const group = chatKind(conversation) === 'group'
  const title = conversationTitle(conversation)
  // participants 不含自己，所以总人数要 +1
  const members = conversation.participants.length + 1

  return (
    <div
      className="row"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(conversation.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(conversation.id)
        }
      }}
    >
      <Avatar
        name={title}
        hue={avatarHue(conversation)}
        size={46}
        label={group ? conversation.participants.slice(0, 2).map((p) => firstGrapheme(p.name)).join('') : undefined}
      />
      <div className="row__main">
        <div className="row__title">
          <span className="row__name">{title}</span>
          {group ? <span className="row__count">{t('list.members', { n: members })}</span> : null}
        </div>
        <div className="row__preview">
          {last === undefined ? null : last.senderId === SELF_ID ? (
            <>
              <em>{t('list.ownPrefix')}</em>
              {previewText(last)}
            </>
          ) : (
            previewText(last)
          )}
        </div>
      </div>
      <div className="row__side">
        <span className="row__time">{last === undefined ? null : formatListTime(last.at, now)}</span>
        {conversation.unread > 0 ? <span className="row__unread">{conversation.unread}</span> : null}
      </div>
    </div>
  )
}
