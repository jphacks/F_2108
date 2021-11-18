import React, { useEffect, FC, useReducer } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import authReducer from "@reducers/authReducer"
import { useAuthUser } from "@hooks/useAuth"
import { authUseCase } from "@useCase"
import { useWindowSize } from "@hooks/useWindowSize"

const Login: FC = () => {
  const router = useRouter()
  const [, dispatch] = useReducer(authReducer.reducer, authReducer.initialState)
  const user = useAuthUser()
  const { width, height } = useWindowSize()

  useEffect(() => {
    user && router.push("/dashboard")
  }, [user])

  const logIn = async () => {
    try {
      await authUseCase.signIn(dispatch)
      router.push("/dashboard")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <article className="w-full min-h-screen bg-[#fbfbfb]">
      <div className="fixed z-0 -top-52 -left-40">
        <Image
          src="/ellipse.svg"
          width={width * 0.4}
          height={width * 0.35}
          className="z-0 w-full object-fit"
        />
      </div>
      <div className="fixed z-0 transform rotate-90 -bottom-52 -left-40">
        <Image
          src="/ellipse.svg"
          width={width * 0.4}
          height={width * 0.35}
          className="z-0 w-full object-fit"
        />
      </div>
      <div className="fixed z-0 transform rotate-90 top-1/4 -right-44">
        <Image
          src="/ellipse.svg"
          width={width * 0.4}
          height={width * 0.35}
          className="z-0 w-full object-fit"
        />
      </div>
      <div className="relative flex-col h-screen px-10">
        <div className="z-10 h-2/5">
          <h1 className="pt-24 text-4xl font-medium text-gray-600 pl-28 font-monob">
            あなたの音声を付箋に。
          </h1>
          <div className="relative z-10 pl-72">
            <Image
              src="/logo_black.png"
              width={400}
              height={160}
              className="w-full object-fit"
            />
          </div>
        </div>
        <div className="relative h-3/5" style={{ width: "60%" }}>
          <Image
            src="/public_discussion.svg"
            width={width * 0.7}
            height={height * 0.6}
            className="w-full object-fit"
          />
        </div>
        <button
          onClick={logIn}
          className="absolute py-2 pl-3 pr-8 text-center text-blue-500 bg-white border-2 border-blue-400 rounded-full hover:bg-gray-200 border-opacity-15 top-1/2 right-32"
        >
          <div className="flex items-center">
            <Image
              src="/icons/g-logo.png"
              width={30}
              height={30}
              className="w-full object-fit"
            />
            <p className="pl-2">Googleアカウントでログイン</p>
          </div>
        </button>
      </div>
    </article>
  )
}

export default Login
