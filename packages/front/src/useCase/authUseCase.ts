import { auth } from "../lib/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { Dispatch } from "react"
import { Action } from "@reducers/authReducer"

export default class AuthUseCase {
  /** サインイン */
  async signIn(dispatch: Dispatch<Action>) {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user
        dispatch({
          type: "login",
          payload: {
            user,
          },
        })
      })
      .catch((error) => {
        const errorCode = error.code
        console.log(error)
        alert(errorCode)
      })
  }
  // ログイン状態の検知
  async isLoggedIn() {
    return auth.currentUser != null
  }

  /**ログアウト */
  async logout() {
    await auth.signOut()
    window.location.reload()
  }
}
