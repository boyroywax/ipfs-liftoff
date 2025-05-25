# syntax=docker/dockerfile:1

# ---- Build Stage ----
FROM node:23.11.0-alpine3.21 AS builder

WORKDIR /app

RUN npm install -g npm@11.4.1

COPY package*.json tsconfig.json ./

RUN npm install

COPY ./src ./src

RUN npm run build


# ---- Production Stage ----
FROM node:23.11.0-alpine3.21

WORKDIR /app

RUN npm install -g npm@11.4.1

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["npm", "run", "start"]
