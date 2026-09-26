# msglist

[![CI](https://github.com/moechat-ai/msglist/actions/workflows/ci.yml/badge.svg)](https://github.com/moechat-ai/msglist/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/moechat-ai/msglist?color=blue)](https://github.com/moechat-ai/msglist/releases)

moechat 的**消息**子应用：会话列表 + 单聊/群聊界面渲染。
挂在第三象限「社会关系」下，是该象限的默认应用。

Web 应用，被四端原生宿主（macOS / iOS / Android / Web）的 WebView 加载。

## 开发

```bash
npm install
npm run dev          # http://localhost:5173
npm run typecheck    # tsc --noEmit
npm run build        # 产出 dist/，宿主加载的就是它
```

浏览器里直接调试时，用 URL 参数模拟宿主：

| 参数 | 作用 |
| --- | --- |
| `?locale=en` | 强制语言，省略则用 `navigator.language` |
| `?conversation=c1` | 直接打开某个会话（宿主跳转通知走这里） |

注意：**本仓库的代码不要放在 S3 / macFUSE 挂载点下**，`node_modules` 会在那里挂起。

## 目录

```
src/
├── main.tsx              入口：定语言 → 渲染
├── App.tsx               两屏导航；会话状态都在这
├── i18n/
│   ├── locales/zh-Hans.ts  基准目录（唯一文案来源）
│   ├── locales/en.ts       英文，类型锁死为 typeof zhHans
│   ├── index.ts            t() / setLocale() / 语言降级
│   └── useLocale.ts        React 订阅
├── host/bridge.ts        子应用侧唯一的宿主适配层
├── model/types.ts        数据类型，不依赖 i18n
├── mock/data.ts          演示数据，接服务端后整份删掉
├── lib/format.ts         Intl 时间格式化
├── lib/title.ts          会话标题（展示层，依赖 i18n）
├── components/           Avatar / MessageBubble
└── views/                ConversationList / Chat
```

## 硬性约定

### 1. 面向用户的文案一律进目录，不许写字面量

`src/i18n/locales/zh-Hans.ts` 是唯一来源，其他语言用 `typeof zhHans` 锁类型。

- 键拼错 → **编译错误**（错误信息会列出所有合法键）
- 漏翻译 → **编译错误**
- 多写键 → **编译错误**

所以「删除 hardcode」不是靠 code review，是靠 `npm run typecheck`。

颜色同理：只有 `src/styles/tokens.css` 允许出现颜色字面量。

### 2. 时间一律走 `Intl`

禁止手工拼 `MM-DD` / `13:07`。用 `lib/format.ts` 里的函数。

### 3. 子应用只用相对路径

宿主给的 origin 两端不同（Android `https://appassets.androidplatform.net`，
macOS `moechat-app://`），写死任何一种都会在另一端挂掉。
`vite.config.ts` 里 `base: './'` 就是为了这个。

### 4. 遇错即崩

数据错误抛异常，不做兜底静默。例如 `mock/data.ts` 里 sender 下标越界会直接抛，
不允许「悄悄变成自己发的」——那会让 bug 潜伏到线上。

## 与宿主的关系

协议、尺寸、配色见 [doc/设计规范.md](doc/设计规范.md)。
宿主的跨端实现见《moechat-宿主设计实现方案》。

当前状态：**子应用本体已完成**；宿主接入（Android → macOS）待做。
`src/host/bridge.ts` 已按协议写好，等宿主侧接上。
