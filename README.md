# 🎲 D&D 5e Rulebook Assistant & Character Creator

像素风的 D&D 5e 规则助手 + 建卡器。用你上传的规则书作为知识源，
用 RAG 严格约束 AI 回答，并提供 9 步引导式角色创建。

## ✨ 功能亮点

- 📚 **规则书管理** — 上传 PDF / TXT / MD / DOCX，自动解析 → 分块 → 向量化
- 🗺 **模组背景导入** — 粘贴文字或截图 OCR，作为 AI 的额外上下文
- 💬 **规则 RAG 问答** — 严格基于规则书回答，带引用来源 + 流式打字机效果
- 🧙 **建卡 9 步向导** — 基础 / 种族 / 职业 / 属性 / 背景 / 技能 / 装备 / 法术 / 预览
- 🎲 **骰子工具** — 解析 `2d6+3`、`4d6kh3` 等表达式，底部常驻投骰栏
- 🕹 **像素风 UI** — 复古边框、羊皮纸面板、CRT 扫描线、8-bit 字体

## 🛠 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 14 App Router + TypeScript |
| 样式 | Tailwind + 自研像素风主题 |
| 数据库 | SQLite (`better-sqlite3`)，向量存 JSON + 内存余弦相似度 |
| LLM | OpenAI 兼容 API（OpenAI / DeepSeek / 智谱 / Moonshot / Ollama 任选） |
| RAG | 自研分块器 + embedding + retriever |
| OCR | `tesseract.js`（前端懒加载） |
| 状态 | Zustand |
| 图标 | lucide-react |

## 🚀 快速开始

```bash
# 1. 安装依赖（首次可能需要 5~8 分钟，因为 tesseract.js / pdf-parse 较大）
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 然后编辑 .env.local 填入 OPENAI_API_KEY (支持任何 OpenAI 兼容供应商)

# 3. 启动开发服务器
npm run dev
# 打开 http://localhost:3000
```

首次启动后，建议流程：

1. 访问 `/rulebooks`：点击 **"加载内置示例"** 验证 RAG 管线可用，
   或直接上传你自己的 5e 规则书 PDF
2. 访问 `/campaign`（可选）：粘贴你的模组背景
3. 访问 `/chat`：开始向 AI 裁判提问
4. 访问 `/create-character`：走完 9 步向导生成角色卡

## 🔌 使用国内 / 自建 LLM

本项目完全使用 OpenAI SDK 的兼容接口，你可以通过改 `.env.local` 切换：

```bash
# DeepSeek
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_API_KEY=sk-xxx
OPENAI_CHAT_MODEL=deepseek-chat
OPENAI_EMBEDDING_MODEL=...   # DeepSeek 暂不提供 embeddings，建议配合 OpenAI 或 BGE

# 智谱 AI
OPENAI_BASE_URL=https://open.bigmodel.cn/api/paas/v4
OPENAI_CHAT_MODEL=glm-4-flash
OPENAI_EMBEDDING_MODEL=embedding-3

# 本地 Ollama（先 ollama pull qwen2.5 / nomic-embed-text）
OPENAI_BASE_URL=http://localhost:11434/v1
OPENAI_API_KEY=ollama    # 任意非空字符串
OPENAI_CHAT_MODEL=qwen2.5
OPENAI_EMBEDDING_MODEL=nomic-embed-text
OPENAI_EMBEDDING_DIM=768
```

⚠ 注意 embedding 维度（`OPENAI_EMBEDDING_DIM`）要和所选模型一致，否则检索会失败。

## 📁 项目结构

```
src/
├── app/                # Next.js App Router（页面 + API routes）
│   ├── page.tsx               主页
│   ├── rulebooks/             规则书管理
│   ├── campaign/              模组背景
│   ├── chat/                  规则 QA
│   ├── create-character/      建卡向导
│   ├── characters/            角色列表 + 详情
│   └── api/                   所有后端 API
├── components/         # React 组件
│   ├── ui/                    像素风基础组件
│   ├── layout/                Navbar / DiceBar
│   ├── chat/                  聊天气泡 / 引用来源
│   ├── character/             建卡向导、角色卡、9 个步骤
│   └── campaign/              OCR 组件
├── lib/                # 核心逻辑
│   ├── db/                    SQLite + schema + queries
│   ├── llm/                   LLM 客户端
│   ├── rag/                   chunker / embeddings / retriever / prompts
│   ├── parsers/               文件解析
│   ├── client/                客户端 SSE 流处理
│   └── dice.ts                骰子表达式求值
├── stores/             # Zustand 状态
├── styles/             # 全局 CSS + 像素主题
└── types/              # TS 类型定义
```

## 🧪 API 一览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/rulebooks/upload` | 上传规则书（multipart） |
| POST | `/api/rulebooks/load-builtin` | 载入内置示例规则 |
| GET | `/api/rulebooks` | 规则书列表 |
| DELETE | `/api/rulebooks/:id` | 删除规则书（级联删 chunks） |
| GET/POST | `/api/campaigns` | 模组背景列表 / 新建 |
| GET/PUT/DELETE | `/api/campaigns/:id` | 单个模组背景 |
| POST | `/api/chat` | RAG 流式聊天（SSE） |
| POST | `/api/rules/query` | 规则 RAG 片段检索 |
| GET/POST | `/api/characters` | 角色列表 / 保存 |
| GET/PUT/DELETE | `/api/characters/:id` | 单个角色 |
| POST | `/api/tools/roll` | 骰子求值 |
| POST | `/api/tools/random-name` | 随机名字 |

## 🎯 实现边界 & 后续计划

**已完成（MVP / P0 + P1）**
- 规则书上传 + 解析 + 向量化
- 模组背景文字输入 + 截图 OCR（前端 tesseract）
- RAG 聊天（流式 + 引用来源）
- 角色创建 9 步向导
- 像素风 UI 主题 + 骰子工具 + JSON 导出

**待完善（P2）**
- 抓取 chm.kagangtuya.top 5e 全书（需要处理 CHM 解码 / 站点结构）
- 角色卡 PDF / 图片导出
- 聊天历史持久化
- 换用 Postgres + pgvector（只需替换 `src/lib/db/` 实现）
- 多职业 / 高级法术 / 专长等高阶建卡逻辑校验
- 骰子 3D 动画

## 📝 License

MIT
