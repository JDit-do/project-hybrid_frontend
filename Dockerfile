# ---- Build ----
FROM node:22-alpine AS builder
WORKDIR /app

# pnpm 사용 
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# 락파일 기반 설치 
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 소스 복사 + 빌드
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---- Run ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# 빌드 산출물만 복사
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
