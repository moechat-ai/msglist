import { t } from '../i18n'
import { SELF_ID, type Message, type Participant } from '../model/types'
import { Avatar } from './Avatar'

interface Props {
  message: Message
  /** 自己发的消息没有 sender */
  sender: Participant | undefined
  /** 群聊里给别人的消息标发送者，单聊不标 */
  showSender: boolean
}

export function MessageBubble({ message, sender, showSender }: Props) {
  const own = message.senderId === SELF_ID

  return (
    <div className={own ? 'msg msg--own' : 'msg'}>
      {!own && sender ? <Avatar name={sender.name} hue={sender.hue} size={30} /> : null}
      <div className="msg__body">
        {showSender && !own && sender ? <div className="msg__sender">{sender.name}</div> : null}
        {message.kind === 'image' ? (
          <div className="imageph">{t('chat.image')}</div>
        ) : (
          <div className="bubble">{message.text}</div>
        )}
      </div>
    </div>
  )
}
