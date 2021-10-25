# 概要

voice tag のサーバーサイドパッケージです。

## Setup

### Prerequisites

- Node.js, yarn のインストール
- Docker, docker-compose のインストール

### Create .env

```bash
cp .env.example .env
```

### Build

```bash
docker-compose build
```

※新たに yarn のパッケージをインストールした際はビルドし直す必要があります。

### Initial run DB

※初回のみ、 DB の起動には時間がかかるので、先に DB のみ起動する

```bash
docker-compose up db
```

### Run

```bash
docker-compose up
```

## DB Migration

※TypeORM の synchronize 機能を ON にしていれば(デフォルト)、ローカルでマイグレーションをする必要はありません。

### Run all existing migrations

```bash
yarn migrate:run
```

### Create new migration

```bash
yarn migrate:generate -n <マイグレーション名>
```

### Revert migration

```bash
yarn migrate:revert
```

### Show migration status

```bash
yarn migrate:show
```
