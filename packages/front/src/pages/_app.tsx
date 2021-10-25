import "../styles/globals.css"
import type { AppProps } from "next/app"
import "../styles/tailwind.css"
import { NextPage } from "next"
// import { useReducer, useEffect } from "react";
// import authReducer from "@reducers/authReducer";
// import { authUseCase } from "@useCase/authUseCase";
import { AuthProvider } from "@contexts/authContext";

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
export default MyApp
