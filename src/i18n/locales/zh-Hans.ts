/**
 * 基准语言目录 —— 全项目文案的**唯一来源**。
 *
 * 其余语言的键类型由本文件推导（`typeof zhHans`），所以：
 * 漏翻译、拼错键名、多写键，都在 `npm run typecheck` 阶段报错。
 * 这是「禁止硬编码文案」的执行手段，比 code review 可靠。
 *
 * 刻意**不加** `as const`：那会把值收窄成字面量，`typeof zhHans` 就变成
 * 「英文必须等于中文原文」。这里要的是键固定、值放宽成 string。
 */
export const zhHans = {
  'app.title': '消息',

  'list.empty': '还没有会话',
  'list.members': '{n} 人',
  /** 群聊没有群名时，成员名的拼接符 */
  'list.nameSeparator': '、',
  /** 会话列表里自己发的那条预览的前缀。含冒号——中文用全角，英文用半角加空格 */
  'list.ownPrefix': '我：',

  'chat.back': '返回',
  'chat.placeholder': '输入消息…',
  'chat.send': '发送',
  'chat.image': '[图片]',
  'chat.day.today': '今天',
  'chat.day.yesterday': '昨天',
}
