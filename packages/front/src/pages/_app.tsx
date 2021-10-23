import "../styles/globals.css"
import type { AppProps } from "next/app"
import "../styles/tailwind.css"
import { NextPage } from "next"

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}
export default MyApp
