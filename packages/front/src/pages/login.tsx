import React, { useEffect, useState, FC, useReducer, ButtonHTMLAttributes } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { authUseCase } from "@useCase/authUseCase"
import authReducer from "@reducers/authReducer"
import { useAuth } from "@hooks/useAuth"

const Login: FC = () => {
  const router = useRouter()
  const [state, dispatch] = useReducer(
    authReducer.reducer,
    authReducer.initialState,
  )
  const user = useAuth()

  useEffect(() => {
    user && router.push("/pdf-sample")
  }, [user])

  const logIn = async () => {
    try {
      await authUseCase().signIn(dispatch);
      router.push("/pdf-sample")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <button onClick={logIn} className="bg-blue-50 hover:bg-gray-200 border-2 border-opacity-25 border-gray-400 text-black text-center py-2 px-4 rounded">googleアカウントでログイン</button>
    </div>
  )
}

export default Login
