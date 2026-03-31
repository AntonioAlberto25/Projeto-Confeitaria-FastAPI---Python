# Stage 1: deps — instala dependências Node
FROM node:lts-alpine AS deps
WORKDIR /app
COPY package*.json ./
ENV NODE_ENV=production
RUN npm install

# Stage 2: build — gera bundle Next.js standalone
FROM node:lts-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: runtime — imagem final mínima
FROM node:lts-alpine AS runtime
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
WORKDIR /app
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
ENV NODE_ENV=production
EXPOSE ${PORT:-3000}
CMD ["node", "server.js"]
