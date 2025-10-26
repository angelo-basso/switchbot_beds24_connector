ENV NODE_ENV=production
ENV PORT=3000
# build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install -g yarn
RUN yarn install --immutable --immutable-cache --check-cache
COPY . .
RUN npm run build

# runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
RUN yarn install --immutable --immutable-cache --check-cache
EXPOSE $PORT
CMD ["node", "dist/app.js"]

