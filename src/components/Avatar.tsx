/** 取首个字素簇。用 Array.from 而不是 charAt：中文、emoji 都是多个 UTF-16 码元。 */
export function firstGrapheme(name: string): string {
  return Array.from(name.trim())[0] ?? '?'
}

interface Props {
  name: string
  /** 0–360，由参与者 id 稳定派生 */
  hue: number
  size?: number
  /** 群聊头像显示多个首字，不传则取 name 的首字 */
  label?: string | undefined
}

export function Avatar({ name, hue, size = 42, label }: Props) {
  return (
    <div
      className="avatar"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `hsl(${hue} 48% 42%)`,
      }}
    >
      {label ?? firstGrapheme(name)}
    </div>
  )
}
