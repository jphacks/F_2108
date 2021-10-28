FROM node:14.18.1

RUN mkdir -p /app/packages/server
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY packages/server/package.json ./packages/server
RUN yarn install

COPY tsconfig.json ./
COPY packages/server ./packages/server
RUN yarn build:server

EXPOSE 3000

CMD ["yarn", "start:server"]
