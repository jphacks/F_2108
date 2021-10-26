import { auth } from "../lib/auth"
import {
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth"
import { Dispatch } from "react"
import { Action } from "@reducers/authReducer"

export const authUseCase = () => {
  /** サインイン */
  const signIn = async (
    dispatch: Dispatch<Action>,
  ) => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
  .then((result) => {
    const user = result.user;
    dispatch({
      type: "login",
      payload: {
        user,
      },
    })
  }).catch((error) => {
    const errorCode = error.code;
    console.log(error)
    alert(errorCode)
  });
  }
  // ログイン状態の検知
  const isLoggedIn = async () => {
    let isLoggedIn = false
    await auth.onAuthStateChanged(async function (user) {
      console.log("user---", user)
      if (user) {
        isLoggedIn = true
      }
    })
    return isLoggedIn
  }

  /**ログアウト */
  const logout = () => {
    auth.signOut().then(() => {
      window.location.reload()
    })
  }

  return { signIn, isLoggedIn, logout }
}
