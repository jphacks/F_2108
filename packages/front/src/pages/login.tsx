import React, { useEffect, useState, FC, useReducer } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { authUseCase } from "@useCase/authUseCase"
import authReducer from "@reducers/authReducer"
import { useAuth } from "@hooks/useAuth"

const Login: FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [state, dispatch] = useReducer(
    authReducer.reducer,
    authReducer.initialState,
  )
  const user = useAuth()

  useEffect(() => {
    user && router.push("/pdf-sample")
  }, [user])

  const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await authUseCase().signIn(email, password, dispatch)
      router.push("/pdf-sample")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <form onSubmit={logIn}>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <Link href="/signup">
        <a>signup</a>
      </Link>
    </div>
  )
}

export default Login
