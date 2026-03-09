FROM node:20.11-alpine as dependencies
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

FROM node:20.11-alpine as builder
WORKDIR /app
RUN corepack enable
COPY ../../Downloads .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm run build:production

FROM node:20.11-alpine as runner
WORKDIR /app
RUN corepack enable
USER node
ENV NODE_ENV production
COPY --from=builder /app/ ./
EXPOSE 3000
CMD ["pnpm", "start"]
