import "../styles/globals.css"
import type { AppProps } from "next/app"
import "../styles/tailwind.css"
import { NextPage } from "next"
// import { useReducer, useEffect } from "react";
// import authReducer from "@reducers/authReducer";
// import { authUseCase } from "@useCase/authUseCase";
import { AuthProvider } from "@contexts/authContext"
import { Page } from "@components/pages/Page"

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <AuthProvider>
      <Page>
        <Component {...pageProps} />
      </Page>
    </AuthProvider>
  )
}

export default MyApp
