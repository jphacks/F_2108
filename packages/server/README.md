# 概要

voice tag のサーバーサイドパッケージです。

## Setup Dev Environment
### Prerequisites
- Node.js, yarnのインストール
- Docker, docker-composeのインストール
 
### Build
```bash
docker-compose build
```
※新たにyarnのパッケージをインストールした際はビルドし直す必要があります。

### Initial run DB
※初回のDBの起動には時間がかかるので、先にDBのみ起動する
```bash
doc-ercompose up db
```

### DB Migration
#### Run all existing migrations
```bash
yarn migrate:run
```

#### Create new migration
```bash
yarn migrate:generate -n <マイグレーション名>
```

### Run
```bash
docker-compose up
```
