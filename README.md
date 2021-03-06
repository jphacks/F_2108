# Voice Tag - あなたの音声を付箋に -

発表資料：https://docs.google.com/presentation/d/1k9OKzgEupLBzkmyd6TjX5fwokXsRn2yfYxU2xsJLMv0/edit?usp=sharing

デモ：https://voice-tag-jp.vercel.app/57471d9a-b943-40e7-b97e-a46cda982c73

![image](https://user-images.githubusercontent.com/38308823/139521809-9698edc9-16e3-411c-bb2f-54a44ba91a27.png)
<img src="https://user-images.githubusercontent.com/38308823/139538321-d6a0fc2c-bc8a-46cc-bf71-cf691b29bc09.png" width="400px"/> <img src="https://user-images.githubusercontent.com/38308823/139521840-21272e96-1632-413a-8f2c-b7f6b2ae6abc.png" width="400px"/>


## 製品概要
### 背景(製品開発のきっかけ、課題等）

> テキストベースのコミュニケーションって大変ですよね？

コロナ禍でリモートワークが増え、Slackやメールでのテキストベースのコミュニケーションが増加しました。その中で、対面で行われていたようなコミュニケーション（例えば同じ資料を指差しながらディスカッションしたり、わからない部分を資料作成者に直接聞いたり）が取りづらくなりました。

またテキストベースであるがゆえに、雰囲気や温度感が伝わらず、認識違いが発生したり、過度に堅い文章になってしまったり、言い回しに拘り何度も文章を書き直してしまったりしたことはないでしょうか。

### 製品説明（具体的な製品の説明）
Voice Tagは、PDFファイル上に**自分の声を付箋として残し**、共有できるサービスです。

1. 共有したいPDFファイルをアップロードします。
2. ファイル上の任意の場所をクリックして、音声の付箋を残しましょう。
3. ファイルをチームに共有しましょう。チームメンバーも新たな付箋を追加したり、既存の付箋にコメントを追加したりすることができます。


アプリで、チームメンバーの音声をながら聴きできることでタスク効率化や心理的安全性の向上に寄与します。

Voice Tagでは、アップロードしたPDF資料に音声データを追加し、他のユーザーと相互に音声によるコミュニケーションを行うことができます。


#### 動作確認方法
プロダクトURL：https://voice-tag-jp.vercel.app （バグが残っている可能性がありますmm）
1. ログイン後、ダッシュボードで「+新規」をクリックし、PDF資料をアップロードしてください。
2. PDF資料上の任意の場所で**ダブルクリック**することで音声を追加することができます。（音声追加後、一度ポップアップを閉じて再度開き直すと反映されます）
3. ダッシュボードに戻ると自分が作成したファイルを一覧で見ることができます

### 特長
#### 1. 自分がアップロードしたファイルや共有されたファイルは、ダッシュボード上からいつでも確認することができます。

#### 2. 付箋をスレッドに見立て、コメントを投稿することができます。コメントは、音声でもテキストでも構いません。

#### 3. URLひとつでチームメンバーと共有することができます。一度共有されたファイルはダッシュボード上から確認できるようになります。


### 解決出来ること
#### タスクの効率化
音声ベースのコミュニケーションでは、複雑な事柄を簡潔に伝えやすい、音声情報は脳で処理されやすい、ながら聴きによって可処分時間も多い、といった特徴があります。テキストでは説明に文字数がかかってしまう場合でも、音声ならば、より簡潔かつ的確に伝えることができます。また、テキストであれば文体や言い回しに過度に気を遣ってしまいますが、音声では普段話すように説明することができます。

#### 心理的安全性
音声でチームメンバーとコミュニケーションを図ることでチーム内の心理的安全性をもたらします。（テキストでは相手のテンションや気持ちが伝わりづらいですよね）

### 今後の展望
* アップロードされたPDFファイルからサムネイル画像を自動生成するようにしたい
* テキストの読み上げ機能を追加し、より簡単に耳から情報を得られるようにしたい
* Google Drive等のストレージサービスとの連携

### 注力したこと（こだわり等）
* 録音・音声の再生などの、直感的に使いやすいUIとアニメーション
* CI/CDの設定
* サムネイルの自動生成（プロダクトへの連結が間に合わなかったものの、実装自体はできています）

## 開発技術
### 活用した技術
#### API・データ
* Web Speech API
* Google Drive API

#### フレームワーク・ライブラリ・モジュール
* フロント：TypeScript / React / Next.js / Tailwind.css / Konva.js / PDF.js
* バックエンド：Fastify / TypeScript / TypeORM / ImageMagick
* その他：Github Actions / Vercel / AWS / Firebae (auth, storage)

#### デバイス
* 
* 

### 独自技術
#### ハッカソンで開発した独自機能・技術
* 録音・音声再生時のポップアップUI / 音声波形のUI
  * https://github.com/jphacks/F_2108/blob/main/packages/front/src/components/components/Thread.tsx
  * https://github.com/jphacks/F_2108/blob/main/packages/front/src/components/atoms/AudioGraph.tsx
  * https://github.com/jphacks/F_2108/blob/main/packages/front/src/components/atoms/Stamp.tsx
* サムネイルの自動生成
  * https://github.com/jphacks/F_2108_1 （別レポジトリ）
* その他全てのコードはハッカソン期間中に書いています

---
# 開発

## パッケージ構成
yarn workspaceを利用してfront/serverのパッケージを作成しています。tsconfig/esLintrc/prettierrc等をまとめて設定しています。
```
packages/
  ├─ front/  クライアントサイド
  └─ server/ サーバーサイド
```

## 開発
各パッケージのREADMEを参照ください

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
