import React, { useEffect, FC, useReducer } from "react"
import { useRouter } from "next/router"
import authReducer from "@reducers/authReducer"
import { useAuth } from "@hooks/useAuth"
import { authUseCase } from "@useCase"

const Login: FC = () => {
  const router = useRouter()
  const [state, dispatch] = useReducer(
    authReducer.reducer,
    authReducer.initialState,
  )
  const user = useAuth()

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
    <div>
      <button
        onClick={logIn}
        className="px-4 py-2 text-center text-black border-2 border-gray-400 border-opacity-25 rounded bg-blue-50 hover:bg-gray-200"
      >
        googleアカウントでログイン
      </button>
    </div>
  )
}

export default Login
