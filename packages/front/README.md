## 開発

初回のみライブラリのインストール

```bash
yarn
```

開発サーバ立ち上げ

```bash
yarn dev
```

`/login`にアクセスしてログインしてください！

## Architecture

```
├── components.          ## UIコンポーネントを定義(AtomicDesign)
├── domain               ## ドメインモデルとドメインロジック
├── hooks                ## 汎用的なhooksとuseCase周りのhooks
├── lib                  ## 例外クラスとAPIクライアントクラス
├── mocks                ## ドメインモデルに紐づくmockObject(使わないかも)
├── useCase              ## APIコールに関する処理をアプリケーションサービスとして定義
├── styles               ## CSSファイル定義
└── pages                ## Next.jsにおける自動ルーティングファイル定義
```
