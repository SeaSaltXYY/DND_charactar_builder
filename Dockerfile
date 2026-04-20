FROM node:20-alpine AS base

# 安装编译 better-sqlite3 所需的原生依赖
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# ── 安装依赖 ──────────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ── 构建 ─────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建 Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── 生产镜像 ─────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 复制构建产物（public 目录可能不存在，先建空目录兜底）
RUN mkdir -p ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 复制数据文件（种子文件、源码数据，用于运行时访问）
COPY --from=builder /app/src/data ./src/data

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# 数据库存放在持久化卷 /data
ENV DATABASE_PATH=/data/dnd.db

# 启动时确保数据目录存在后再运行
# 启动时：若 /data/dnd.db 不存在则从预构建库解压（auto-seed.ts 也有此逻辑作兜底）
CMD ["sh", "-c", "mkdir -p /data/uploads && node server.js"]
