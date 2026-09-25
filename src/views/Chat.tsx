import { Fragment, useEffect, useRef, useState } from 'react'
import { MessageBubble } from '../components/MessageBubble'
import { t } from '../i18n'
import { formatDayLabel, sameDay } from '../lib/format'
import { conversationTitle } from '../lib/title'
import { chatKind, findParticipant, type Conversation } from '../model/types'

interface Props {
  conversation: Conversation
  now: number
  onBack: () => void
  onSend: (text: string) => void
}

export function Chat({ conversation, now, onBack, onSend }: Props) {
  const [draft, setDraft] = useState('')
  const scroller = useRef<HTMLDivElement>(null)

  const group = chatKind(conversation) === 'group'
  const title = conversationTitle(conversation)
  const members = conversation.participants.length + 1

  // 进入会话和新消息进来时贴底
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [conversation.id, conversation.messages.length])

  const submit = () => {
    const text = draft.trim()
    if (text === '') return
    onSend(text)
    setDraft('')
  }

  return (
    <>
      <header className="hdr">
        <button className="iconbtn" type="button" onClick={onBack} aria-label={t('chat.back')}>
          <BackIcon />
        </button>
        <h1 className="hdr__title">{title}</h1>
        {group ? <span className="hdr__sub">{t('list.members', { n: members })}</span> : null}
      </header>

      <div className="scroller stream" ref={scroller}>
        {conversation.messages.map((message, index) => {
          const prev = conversation.messages[index - 1]
          const newDay = prev === undefined || !sameDay(prev.at, message.at)
          return (
            <Fragment key={message.id}>
              {newDay ? <div className="daysep">{formatDayLabel(message.at, now)}</div> : null}
              <MessageBubble
                message={message}
                sender={findParticipant(conversation, message.senderId)}
                showSender={group}
              />
            </Fragment>
          )
        })}
      </div>

      <div className="composer">
        <textarea
          className="composer__input"
          rows={1}
          placeholder={t('chat.placeholder')}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              submit()
            }
          }}
        />
        <button className="composer__send" type="button" onClick={submit} disabled={draft.trim() === ''}>
          {t('chat.send')}
        </button>
      </div>
    </>
  )
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M10 3 5 8l5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
