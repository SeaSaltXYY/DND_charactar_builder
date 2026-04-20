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

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制数据文件（种子文件、源码数据，用于运行时访问）
COPY --from=builder /app/src/data ./src/data

# 创建数据目录（用于 SQLite 数据库和上传文件）
RUN mkdir -p /data/uploads && chown -R nextjs:nodejs /data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# 数据库存放在持久化卷 /data
ENV DATABASE_PATH=/data/dnd.db

CMD ["node", "server.js"]
