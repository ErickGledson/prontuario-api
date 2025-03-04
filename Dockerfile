FROM node:23.9.0-alpine AS dev
WORKDIR /app
    COPY package.json package-lock.json ./
    RUN npm install
    COPY . .
    CMD ["npm", "run", "dev"]

FROM node:23.9.0-alpine AS build
WORKDIR /app
    COPY package.json package-lock.json ./
    RUN npm install --omit=dev
    COPY . .

FROM gcr.io/distroless/nodejs22-debian12 AS release
WORKDIR /app
    COPY --from=build /app /app
    CMD ["src/server.js"]

FROM build AS test
WORKDIR  /app
    CMD ["npx", "jest", "--runInBand", "--detectOpenHandles"]