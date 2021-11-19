import React from "react"
import Head from "next/head"
import type { AppProps } from "next/app"
import { NextPage } from "next"
import { AuthProvider } from "@contexts/authContext"
import { Page } from "@components/pages/Page"
import "../styles/globals.css"
import "../styles/tailwind.css"

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      </Head>
      <AuthProvider>
        <Page>
          <Component {...pageProps} />
        </Page>
      </AuthProvider>
    </>
  )
}

export default MyApp
