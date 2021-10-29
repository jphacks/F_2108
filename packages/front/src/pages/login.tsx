import React, { useEffect, FC, useReducer } from "react"
import { useRouter } from "next/router"
// import Image from "next/image"
import authReducer from "@reducers/authReducer"
import { useAuth } from "@hooks/useAuth"
import { authUseCase } from "@useCase"
import { useWindowSize } from "@hooks/useWindowSize"
import dynamic from "next/dynamic"
const Image = dynamic(() => import("next/image"), {
  ssr: false,
})

const Login: FC = () => {
  const router = useRouter()
  const [state, dispatch] = useReducer(
    authReducer.reducer,
    authReducer.initialState,
  )
  const user = useAuth()
  const { width, height } = useWindowSize()

  useEffect(() => {
    user && router.push("/pdf-sample")
  }, [user])

  const logIn = async () => {
    try {
      await authUseCase.signIn(dispatch)
      router.push("/pdf-sample")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <div className="fixed -top-52 -left-40 z-0">
        <Image
          src="/ellipse.svg"
          width={width * 0.4}
          height={width * 0.35}
          className="object-fit w-full z-0"
        />
      </div>
      <div className="fixed -bottom-52 -left-40 z-0 transform rotate-90">
        <Image
          src="/ellipse.svg"
          width={width * 0.4}
          height={width * 0.35}
          className="object-fit w-full z-0"
        />
      </div>
      <div className="fixed top-1/4 -right-44 z-0 transform rotate-90">
        <Image
          src="/ellipse.svg"
          width={width * 0.4}
          height={width * 0.35}
          className="object-fit w-full z-0"
        />
      </div>
      <div className="relative h-screen flex-col px-10">
        <div className="h-2/5 z-10">
          <h1 className="text-4xl pt-24 pl-28 font-monob text-gray-600 font-medium">
            あなたの音声を付箋に。
          </h1>
          <div className="relative pl-72 z-10">
            <Image
              src="/logo_black.png"
              width={400}
              height={160}
              className="object-fit w-full"
            />
          </div>
        </div>
        <div className="relative h-3/5" style={{ width: "70%" }}>
          <Image
            src="/discussion.png"
            width={width * 0.7}
            height={height * 0.6}
            className="object-fit w-full"
          />
        </div>
        <button
          onClick={logIn}
          className="absolute bg-white hover:bg-gray-200 border-2 border-opacity-15 border-blue-400 text-blue-500 text-center py-2 pr-8 pl-3 rounded-full top-1/2 right-32"
        >
          <div className="flex items-center">
            <Image
              src="/icons/g-logo.png"
              width={30}
              height={30}
              className="object-fit w-full"
            />
            <p className="pl-2">Googleアカウントでログイン</p>
          </div>
        </button>
      </div>
    </>
  )
}

export default Login
