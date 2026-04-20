# 部署指南 — Railway

## 概览

本项目使用：
- **聊天 LLM**：DeepSeek / OpenAI 兼容 API（云端，需要 API Key）
- **Embedding**：硅基流动 免费 API（云端）
- **数据库**：SQLite（需要持久化磁盘）
- **平台**：Railway（支持原生模块 + 持久化磁盘）

---

## 第一步：准备 API Key

| 服务 | 用途 | 获取地址 |
|------|------|----------|
| DeepSeek | 聊天 LLM | https://platform.deepseek.com |
| 硅基流动 | Embedding | https://cloud.siliconflow.cn（免费注册）|

**注意**：BAAI/bge-large-zh-v1.5 是 1024 维，需要把 `OPENAI_EMBEDDING_DIM` 设为 `1024`。

---

## 第二步：修改本地 .env.local（换成云端 API）

```env
# 聊天 LLM（DeepSeek，不变）
OPENAI_API_KEY=sk-your-deepseek-key
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_CHAT_MODEL=deepseek-chat

# Embedding（换成硅基流动，不再用 Ollama）
EMBED_API_KEY=sk-your-siliconflow-key
EMBED_BASE_URL=https://api.siliconflow.cn/v1
OPENAI_EMBEDDING_MODEL=BAAI/bge-large-zh-v1.5
OPENAI_EMBEDDING_DIM=1024

# 数据库（本地）
DATABASE_PATH=./data/dnd.db
```

**重新生成种子文件**（因为 embedding 维度变了，需要重新向量化）：
```bash
# 先清空旧数据库（维度不同无法混用）
rm -f data/dnd.db
```
种子文件本身不含 embeddings，数据库清空后首次访问会自动重新向量化。

---

## 第三步：部署到 Railway

### 3.1 安装 Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### 3.2 初始化项目
```bash
cd /path/to/DND_Builder
railway init
# 选择 "Empty Project"，填入项目名称
```

### 3.3 添加持久化磁盘（关键！）
在 Railway 控制台：
1. 进入你的服务 → **Volumes** → **Add Volume**
2. 挂载路径：`/data`
3. 大小：至少 **2 GB**（SQLite + 上传文件）

### 3.4 设置环境变量
在 Railway 控制台 → **Variables** 中添加：

```
OPENAI_API_KEY=sk-your-deepseek-key
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_CHAT_MODEL=deepseek-chat

EMBED_API_KEY=sk-your-siliconflow-key
EMBED_BASE_URL=https://api.siliconflow.cn/v1
OPENAI_EMBEDDING_MODEL=BAAI/bge-large-zh-v1.5
OPENAI_EMBEDDING_DIM=1024

DATABASE_PATH=/data/dnd.db
NEXT_PUBLIC_APP_NAME=D&D 5e Assistant
```

### 3.5 上传种子文件到 Volume

种子文件太大（9.8 MB 压缩后）不走 git，需要手动上传：

```bash
# 方法一：用 Railway CLI 连接 Volume
railway shell
# 然后在 shell 里：
mkdir -p /app/src/data
# 退出，再用 scp 或 Railway 的文件管理器上传

# 方法二（推荐）：构建时直接复制
# Dockerfile 已经处理好了：COPY --from=builder /app/src/data ./src/data
# 只要 seed 文件在 git 中（用 Git LFS），就会自动打包进 Docker 镜像
```

**推荐做法 —— 使用 Git LFS 追踪大文件：**
```bash
git lfs install
git lfs track "src/data/*.gz"
git add .gitattributes src/data/rulebook-seed.json.gz
git commit -m "add rulebook seed with git lfs"
```
这样文件会随 Docker build 自动打包进镜像，Railway 构建时会自动拉取。

### 3.6 部署
```bash
git add .
git commit -m "add railway deployment config"
railway up
```

---

## 关于 5E 不全书的说明

- 种子文件（`src/data/rulebook-seed.json.gz`）包含预解析的 **5019 个文本 chunks**，**不含 embeddings**
- 每次部署后第一次访问，系统会**自动异步向量化**（用你配置的 embedding API）
- 向量化结果存在 Railway Volume 的 SQLite 里，**重启不会丢失**
- 向量化时间取决于 API 速度：硅基流动约 15-30 分钟，OpenAI 约 5-10 分钟

---

## 费用估算

| 项目 | 费用 |
|------|------|
| Railway 服务 | ~$5/月（Hobby Plan）|
| Railway Volume（2GB）| ~$0.25/月 |
| DeepSeek 聊天 | 按量计费，约 $0.001/千 token，日常使用 <$5/月 |
| 硅基流动 Embedding | **免费**（每天有额度限制）|
| **合计** | **约 $10/月** |

---

## 本地开发 vs 线上

| 项目 | 本地 | 线上（Railway）|
|------|------|----------------|
| Embedding | Ollama 本地 | 硅基流动 API |
| 数据库路径 | `./data/dnd.db` | `/data/dnd.db` |
| CHM 上传解析 | 需要本地 7z | 需要在 Dockerfile 安装 p7zip |

> 线上如果需要支持 CHM 上传，在 Dockerfile 中添加：`RUN apk add --no-cache p7zip`
