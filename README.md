# 🎲 D&D 5e Assistant & Character Creator

像素风的 D&D 5e 规则助手 + 全功能建卡器。内置《D&D 5E 不全书》5019 个规则书分块，无需上传即可立即开始使用 AI 问答和建卡。

## ✨ 功能亮点

- 📚 **规则书管理** — 内置《D&D 5E 不全书》，支持追加上传 PDF / TXT / MD / CHM，自动解析 → 分块 → 向量化
- 💬 **规则问答** — 基于规则书检索回答，带引用来源 + 流式输出；自动排除 2024/2025 新版核心内容
- 🧙 **AI 辅助建卡** — 双面板布局（左：角色卡 / 右：AI 对话）；AI 建议需确认后才会填入
- 🗂 **全字段角色卡** — 属性值（种族/成长/修正值分层显示）、战斗数据、技能、装备、法术、魔宠
- 🎲 **骰子工具** — 支持 `2d6+3`、`4d6kh3` 等表达式，底部常驻投骰栏
- 📖 **法术大全** — 收录 572 个法术（0–9 环），按出处分类，可开关扩展书来源
- ✨ **塔莎书规则** — 属性值面板集成开关，开启后可自定义种族加值（+2 / +1 任选）
- 🕹 **像素风 UI** — 复古边框、羊皮纸面板、8-bit 字体

## 🛠 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 14 App Router + TypeScript |
| 样式 | Tailwind CSS + 自研像素风主题 |
| 数据库 | SQLite (`better-sqlite3`)，向量存 JSON + 内存余弦相似度 |
| LLM | OpenAI 兼容 API（DeepSeek / OpenAI / Moonshot / Ollama 任选） |
| Embedding | SiliconFlow（BAAI/bge-large-zh-v1.5，1024 维） |
| RAG | 自研分块器 + embedding + retriever；预构建 DB（`dnd-prebuilt.db.gz`） |
| 状态 | Zustand |
| 图标 | lucide-react |

## 🚀 快速开始（本地开发）

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填写 DeepSeek（聊天）和 SiliconFlow（向量）API Key

# 3. 启动开发服务器
npm run dev
# 打开 http://localhost:3000
```

首次启动时，系统会自动加载内置《D&D 5E 不全书》（5019 个分块），无需手动操作。

## 🔑 环境变量说明

```bash
# .env.local

# 聊天模型（DeepSeek，推荐）
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_CHAT_MODEL=deepseek-chat

# 向量 Embedding（SiliconFlow，免费）
EMBED_API_KEY=sk-xxx
EMBED_BASE_URL=https://api.siliconflow.cn/v1
OPENAI_EMBEDDING_MODEL=BAAI/bge-large-zh-v1.5
OPENAI_EMBEDDING_DIM=1024

# 数据库路径
DATABASE_PATH=./data/dnd.db
```

> ⚠ Embedding 维度（`OPENAI_EMBEDDING_DIM`）必须与所选模型一致，否则检索失败。

### 切换其他 LLM 供应商

```bash
# OpenAI
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_CHAT_MODEL=gpt-4o-mini

# 本地 Ollama（需先 ollama pull qwen2.5）
OPENAI_BASE_URL=http://localhost:11434/v1
OPENAI_API_KEY=ollama
OPENAI_CHAT_MODEL=qwen2.5
```

## 📁 项目结构

```
src/
├── app/                   # Next.js App Router（页面 + API routes）
│   ├── page.tsx               主页
│   ├── rulebooks/             规则书管理
│   ├── chat/                  规则问答
│   ├── create-character/      AI 辅助建卡
│   ├── characters/            角色列表 + 详情
│   └── api/                   所有后端 API
├── components/
│   ├── ui/                    像素风基础组件（PixelCard / PixelButton / PixelBadge）
│   ├── layout/                Navbar / DiceSidebar
│   ├── chat/                  聊天气泡 / 引用来源
│   └── character/             建卡面板、角色卡各区段、AI 对话
├── data/                  # 静态数据（种族、职业、背景、法术 572 条、装备）
│   └── dnd-prebuilt.db.gz     预构建向量数据库（内置规则书）
├── lib/
│   ├── db/                    SQLite schema / queries
│   ├── llm/                   LLM 客户端
│   ├── rag/                   chunker / embeddings / retriever / prompts
│   ├── parsers/               文件解析（PDF / TXT / CHM / DOCX）
│   ├── client/                客户端 SSE 流处理
│   ├── character-calc.ts      衍生属性计算引擎
│   └── dice.ts                骰子表达式求值
├── stores/                # Zustand 状态（character-store）
├── styles/                # 全局 CSS + 像素风主题
└── types/                 # TypeScript 类型定义
```

## 🌐 部署到 Railway

详细步骤参见 [`DEPLOY.md`](./DEPLOY.md)。简要流程：

1. Fork 本仓库到 GitHub
2. 在 Railway 新建项目并关联仓库（自动检测 `Dockerfile`）
3. 设置环境变量（同 `.env.example`）
4. 挂载 `/data` 持久卷（存放数据库和上传文件）
5. 部署完成后，`dnd-prebuilt.db.gz` 会在首次启动时自动解压为可用的规则库

预估费用：约 $10/月（Railway ~$5 + DeepSeek <$5）

## 🧪 主要 API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/rulebooks/upload` | 上传规则书（multipart） |
| GET | `/api/rulebooks` | 规则书列表 |
| DELETE | `/api/rulebooks/:id` | 删除规则书（内置规则书受保护） |
| POST | `/api/chat` | RAG 流式聊天（SSE），支持 `character_update` 事件 |
| GET/POST | `/api/characters` | 角色列表 / 保存 |
| GET/PUT/DELETE | `/api/characters/:id` | 单个角色 |
| POST | `/api/tools/roll` | 骰子表达式求值 |

## 📝 License

MIT
