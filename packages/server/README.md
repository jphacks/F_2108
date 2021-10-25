# 概要

voice tag のサーバーサイドパッケージです。

## Setup Dev Environment

### Prerequisites

- Node.js, yarn のインストール
- Docker, docker-compose のインストール

### Build

```bash
docker-compose build
```

※新たに yarn のパッケージをインストールした際はビルドし直す必要があります。

### Initial run DB

※初回の DB の起動には時間がかかるので、先に DB のみ起動する

```bash
docker-compose up db
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
