import { FC, useEffect, useState, useReducer} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { authUseCase } from '@useCase/authUseCase';
import authReducer from '@reducers/authReducer';
import { useAuth } from '@hooks/useAuth';

const SignUp: FC = () => {
  const router = useRouter()
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [dispatch] = useReducer(
    authReducer.reducer,
    authReducer.initialState
	);
	const user = useAuth()

	useEffect(() => {
		user && router.push('/pdf-sample')
  }, [user])

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await authUseCase().signUp(email, password, dispatch)
      router.push('/pdf-sample')
		} catch (err) {
			console.log(err)
    }
  }

  return (
    <div>
      <form onSubmit={createUser}>
        <div>
          <label htmlFor="email">
            Email:{' '}
          </label>
          <input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">
            Password:{' '}
          </label>
          <input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">
          SignUp
        </button>
      </form>
      <Link href="/login">
        <a>Login</a>
      </Link>
    </div>
  )
}

export default SignUp