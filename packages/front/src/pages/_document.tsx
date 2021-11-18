import React from "react"
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document"

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="ja" prefix="og: http://ogp.me/ns#">
        <Head>
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1.0"
          />
          <meta
            name="description"
            content="あなたの声を付箋に。PDFファイル上に音声ふせんを配置し、URLで共有できるサービスです。"
          />
          <meta property="og:url" content={NEXT_PUBLIC_URL + "/login"} />
          <meta property="og:title" content="Voice Tag" />
          <meta property="og:site_name" content="Voice Tag" />
          <meta
            property="og:description"
            content="あなたの声を付箋に。PDFファイル上に音声ふせんを配置し、URLで共有できるサービスです。"
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/ogp.png" />
          <meta property="og:locale" content="ja_JP" />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="canonical" href={NEXT_PUBLIC_URL} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
