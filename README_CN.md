# Claude Code — 本地可运行版本

> 基于 **2026 年 3 月 31 日** 通过 npm 包 source map 泄漏而公开的 Claude Code 源码快照。本 fork 补全了所有构建基础设施和依赖 stub，使其可以**在本地完整运行**。

---

## 快速开始

### 环境要求

- [Bun](https://bun.sh) >= 1.3（安装：`curl -fsSL https://bun.sh/install | bash`）
- Anthropic API Key（或兼容的代理 API）

### 安装与启动

```bash
git clone https://github.com/turf0909/claude-code.git
cd claude-code
bun install

# 交互式模式（完整终端 UI）
bun run start

# 开发模式（代码修改后自动重启）
bun run dev

# 非交互式模式（适合管道调用）
bun run print -- "你的问题"
```

### 使用代理 API

```bash
# 直连 Anthropic API
ANTHROPIC_API_KEY="sk-ant-xxx" bun run start

# 第三方代理（OpenRouter、自建中转等）
ANTHROPIC_API_KEY="sk-xxx" ANTHROPIC_BASE_URL="https://your-proxy.com/v1" bun run start

# AWS Bedrock
AWS_REGION="us-east-1" bun run start

# Google Vertex AI
ANTHROPIC_VERTEX_PROJECT_ID="your-project" CLOUD_ML_REGION="us-east5" bun run start
```

### 选择模型

```bash
bun run start -- --model sonnet      # Sonnet（快速）
bun run start -- --model opus        # Opus（最强）
bun run start -- --model haiku       # Haiku（最快）
bun run start -- --model claude-sonnet-4-6  # 完整模型 ID
```

---

## 相比原始源码快照做了什么

原始快照仅包含 `src/` 目录（~1,900 文件，512K+ 行代码）。本 fork 补全了运行所需的全部基础设施：

| 分类 | 文件数 | 说明 |
|------|--------|------|
| 构建配置 | 3 | `package.json`、`tsconfig.json`、`bunfig.toml` |
| 运行时预加载 | 2 | MACRO 常量注入 + `bun:bundle` feature flag 模拟 |
| 缺失的类型定义 | 8 | `message.ts`、`tools.ts`、`utils.ts` 等（source map 未捕获） |
| SDK 生成文件 | 6 | 从 Zod schemas 推导的类型定义 |
| 依赖 Stub 包 | 48 | 私有 `@ant/*` 包、`@anthropic-ai/*` 内部包、NAPI 原生模块 |
| Skill 文档 | 28 | 技能系统知识库内容（.md 文件） |
| 源码补丁 | 4 | react-reconciler 兼容、execa 版本兼容、Commander.js 兼容 |

**总计新增**：~110 文件，~5,000 行（占代码库 ~1%）

---

## 还原度

| 功能模块 | 状态 | 说明 |
|---------|------|------|
| **核心 CLI**（工具、命令、MCP、UI） | ~100% | 全部 1,903 个源文件正确加载 |
| **交互式模式**（终端 REPL） | 正常 | 完整的 Ink/React 终端界面 |
| **打印模式**（`-p`） | 正常 | API 调用 + 结果输出 |
| **子命令**（`mcp list`、`--help` 等） | 正常 | |
| **Bridge 模式**（IDE 集成） | 已启用 | VS Code/JetBrains 桥接，未完整测试 |
| **语音模式** | 已启用 | 需要安装 SoX 命令行工具 |
| **Computer Use** | 已 Stub | 需要 Anthropic 私有 `@ant/*` 包 |
| **Chrome 集成** | 已 Stub | 需要 Anthropic 私有 `@ant/*` 包 |
| **安全沙箱** | 已 Stub | 需要 `@anthropic-ai/sandbox-runtime` |
| **原生模块**（音频、图像、键盘） | 优雅降级 | NAPI 二进制不可用，提供 JS fallback |

**整体还原度：~92-95%**

---

## 项目结构

```text
claude-code/
├── package.json              # 依赖声明 & 启动脚本
├── tsconfig.json             # TypeScript 编译配置
├── bunfig.toml               # Bun 运行时配置（preload、bundle defines）
├── stubs/                    # 缺失依赖的 Stub 包
│   ├── preload.ts            # MACRO 构建常量注入
│   ├── bunPlugin.ts          # bun:bundle feature flag 模拟
│   ├── computer-use-mcp/     # @ant/computer-use-mcp stub
│   ├── sandbox-runtime/      # @anthropic-ai/sandbox-runtime stub
│   ├── audio-capture-napi/   # 原生音频捕获 stub
│   └── ...                   # 共 11 个 stub 包
│
├── src/                      # 原始 Claude Code 源码（~1,900 文件）
│   ├── main.tsx              # CLI 入口（Commander.js）
│   ├── entrypoints/cli.tsx   # 启动引导 & 快速路径
│   ├── commands.ts           # 斜杠命令注册表（~50 个命令）
│   ├── tools.ts              # 工具注册表（~40 个工具）
│   ├── Tool.ts               # 工具类型定义
│   ├── QueryEngine.ts        # LLM 查询引擎
│   │
│   ├── commands/             # /commit, /review, /compact, /mcp, ...
│   ├── tools/                # Bash, Edit, Read, Write, Glob, Grep, Agent, ...
│   ├── components/           # React/Ink UI 组件（~140 个）
│   ├── services/             # API 客户端、MCP、OAuth、分析、...
│   ├── bridge/               # IDE 桥接（VS Code、JetBrains）
│   ├── coordinator/          # 多 Agent 协调器
│   ├── ink/                  # 自定义 Ink 渲染器（yoga 布局、diff 引擎）
│   ├── native-ts/            # 原生模块的纯 TS 移植版本
│   ├── skills/               # 技能系统 + 内置技能文档
│   ├── plugins/              # 插件系统
│   └── ...
│
├── README.md                 # 英文文档
└── README_CN.md              # 中文文档（本文件）
```

---

## 技术栈

| 分类 | 技术 |
|------|------|
| 运行时 | [Bun](https://bun.sh) |
| 语言 | TypeScript（strict 模式） |
| 终端 UI | React 19.2 + 自定义 [Ink](https://github.com/vadimdemedes/ink) |
| CLI 解析 | [Commander.js](https://github.com/tj/commander.js)（extra-typings） |
| Schema 校验 | [Zod v4](https://zod.dev) |
| 代码搜索 | [ripgrep](https://github.com/BurntSushi/ripgrep)（内嵌于 Bun） |
| 协议 | [MCP SDK](https://modelcontextprotocol.io)、LSP |
| API | [Anthropic SDK](https://docs.anthropic.com)、Bedrock、Vertex、Foundry |
| 遥测 | OpenTelemetry |
| Feature Flags | GrowthBook + `bun:bundle` 编译时死代码消除 |

---

## 关键技术决策

### 1. MACRO 构建常量
官方构建通过 Bun 的 `--define` 在构建时内联常量。我们通过 `stubs/preload.ts` 在运行时注入 `globalThis.MACRO`，功能完全等价。

### 2. Feature Flags
`bun:bundle` 的 `feature()` 是编译时函数。我们通过 Bun 插件（`stubs/bunPlugin.ts`）模拟：源码缺失的功能模块被禁用（23 个 flag），源码完整的功能已启用。

### 3. React 版本
源码由 React Compiler 编译，目标 React 19.2。我们使用 `react@19.2.0` + `react-reconciler@0.33.0` 匹配。

### 4. 私有依赖
Anthropic 内部包（`@ant/*`、`@anthropic-ai/sandbox-runtime` 等）用最小 API stub 替代。受影响功能（Computer Use、Chrome 集成）不可用，但不影响启动和核心功能。

### 5. 原生模块
4 个 NAPI 原生模块（音频捕获、图像处理、键盘修饰键、URL 处理）提供 no-op stub。3 个核心原生模块（color-diff、file-index、yoga-layout）已有纯 TypeScript 移植版本在 `src/native-ts/` 中。

---

## 调试指南

### 启动参数

```bash
# 调试模式（详细日志输出）
bun run start -- --debug

# 调试日志输出到 stderr
bun run start -- --debug-to-stderr

# 调试日志写入文件
bun run start -- --debug-file /tmp/claude-debug.log

# 跳过所有权限检查（仅限安全沙箱环境）
bun run start -- --dangerously-skip-permissions

# 指定权限模式
bun run start -- --permission-mode plan
```

### 常用测试命令

```bash
# 测试 API 连通性
bun run print -- "say hi"

# 查看版本
bun run start -- --version

# 查看完整帮助
bun run start -- --help

# 环境诊断
bun run start -- doctor

# 列出 MCP 服务器状态
bun run start -- mcp list
```

### 非交互式模式

```bash
# 基本用法
bun run print -- "解释这段代码的作用"

# JSON 输出
bun run start -- -p "hello" --output-format json

# 流式 JSON 输出（适合 SDK 集成）
bun run start -- -p "hello" --output-format stream-json --verbose

# 限制预算
bun run start -- -p "review this code" --max-budget-usd 0.5
```

### 如果遇到问题

1. **空白屏幕**：确保 `execa` 版本为 v8（`bun add execa@8`）
2. **useEffectEvent 错误**：确保 `react@19.2.0` + `react-reconciler@0.33.0`
3. **Module not found**：运行 `bun install` 重新安装依赖
4. **API 认证失败**：设置 `ANTHROPIC_API_KEY` 环境变量
5. **版本太旧被拒**：检查 `stubs/preload.ts` 中的 `MACRO.VERSION`

---

## 免责声明

- 本仓库为**教育和研究用途**的存档。
- Claude Code 原始源代码为 **Anthropic** 的财产。
- 本仓库**不隶属于、未获得 Anthropic 的认可或维护**。
- 源码通过 2026-03-31 npm 包的 source map 暴露而公开可访问。
