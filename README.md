# Voice Tag

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2021/07/JPHACKS2021_ogp.jpg)](https://www.youtube.com/watch?v=LUPQFB4QyVo)

動画：https://drive.google.com/file/d/1UXv9dv-x4fHQktSrwWDFD8oFag37dqoD/view?usp=sharing

## 製品概要
### 背景(製品開発のきっかけ、課題等）
新型コロナウイルスの感染拡大に伴い、リモートワークやリモートでの授業が一般化した今、より快適なコミュニケーションを促進したいと考えました。
### 製品説明（具体的な製品の説明）
PDF上で自分の音声を付箋に残し共有するアプリで、チームメンバーの音声をながら聴きできることでタスク効率化や心理的安全性の向上に寄与します。

議事録やスライド資料の共有の際、資料の特定の箇所に関する細かい説明や質問を行いたい時はありませんか。Voice Tagはその課題を解決します。音声はテキストより複雑な事柄を伝えやすい、音声情報は脳で処理されやすい、ながら聴きによって可処分時間も多いと言われています。また音声でチームメンバーとコミュニケーションを図ることでチーム内の心理的安全性をもたらします。さらに、デジタルで送迎会などの色紙を作りたい時、歌の練習成果をPDF上に残したい時、voice tagをクリエイティブに使用することもできます。つまりvoice tagは、音声の特性を生かし、多くの人の学びや仕事をより快適にします。


### 特長
####1. 特長1
PDFをアップロードして、PDF上に音声を付箋の形で貼れること

####2. 特長2
付箋の中でスレッドを展開し議論できること

####3. 特長3
付箋がついたファイルを他の人とURLひとつで共有できること


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
* フロント：React / Next.js / TypeScript / Konva.js
* バックエンド：Fastify / TypeScript / TypeORM
* その他：AWS / Vercel / Firebae Auth / Firebase storage


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
