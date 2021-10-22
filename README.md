# サンプル（プロダクト名）

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2021/07/JPHACKS2021_ogp.jpg)](https://www.youtube.com/watch?v=LUPQFB4QyVo)

## 製品概要
### 背景(製品開発のきっかけ、課題等）
### 製品説明（具体的な製品の説明）
### 特長
####1. 特長1

####2. 特長2

####3. 特長3

### 解決出来ること
### 今後の展望
### 注力したこと（こだわり等）
* 
* 

## 開発技術
### 活用した技術
#### API・データ
* 
* 

#### フレームワーク・ライブラリ・モジュール
* 
* 

#### デバイス
* 
* 

### 独自技術
#### ハッカソンで開発した独自機能・技術
* 独自で開発したものの内容をこちらに記載してください
* 特に力を入れた部分をファイルリンク、またはcommit_idを記載してください。

#### 製品に取り入れた研究内容（データ・ソフトウェアなど）（※アカデミック部門の場合のみ提出必須）
* 


---
# 開発

## パッケージ構成
yarn workspaceを利用してfront/serverのパッケージを作成しています。tsconfig/esLintrc/prettierrc等をまとめて設定しています。
```
packages/
  ├─ front/  クライアントサイド
  └─ server/ サーバーサイド
```

## npm scripts
yarnを利用します。npmを利用するとエラーが出ます。

- yarn dev: 開発サーバーの立ち上げ
- yarn build: ビルド
- yarn start: ビルドしたものを実行する
- yarn lint: Linterを実行する
- yarn format: フォーマッタを実行する
- yarn fix: Linter / フォーマッタの自動修正を行う

`:front`, `:server`がついているものは、それぞれのパッケージ内で実行します

- yarn workspace front/server add xxx: ライブラリの追加（各パッケージのディレクトリに移動してyarn add xxxでも可）