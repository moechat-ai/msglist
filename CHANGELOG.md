# 变更记录

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)，格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

## [0.0.1] - 2026-09-26

首个版本。

### 新增

- 会话列表：单聊与群聊、未读数、成员数徽标、相对时间（`Intl` 按语言切换）
- 聊天界面：日期分隔、发送者标签、图片占位、输入框与发送
- 中英双语。文案目录是类型化的，漏翻译 / 拼错键 / 多写键**都是编译错误**
- 宿主桥：`window.moechat` 读宿主上下文，`window.moechatHost.post` 回传
- 深链：`?conversation=<id>` 直接打开指定会话

### 说明

- 演示数据是假的，见 `src/mock/`。还没接后端
- 布局用 `position: fixed; inset: 0`，不是百分比高度链——原因见 `doc/设计规范.md` §7
