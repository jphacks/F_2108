import { auth } from '../lib/auth'
import { signInWithEmailAndPassword,createUserWithEmailAndPassword } from "firebase/auth";

export const authUseCase = () => {
    /** サインイン */
    const signIn = async (email: string, password:string, dispatch: any) => {
			signInWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					// Signed in
					const user = userCredential.user;
					dispatch({
						type: "login",
						payload: {
							user,
						},
					});
				})
				.catch((error) => {
					error.code ?? alert(error.code)
				});
    }
    /** サインアップ */
    const signUp = async (email: string, password:string, dispatch: any) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed Up
                const user = userCredential.user;
								dispatch({
									type: "login",
									payload: {
										user,
									},
								});
            })
            .catch((error) => {
							console.log(error)
              alert(error.code)
            });
    }
    // ログイン状態の検知
	const isLoggedIn = async () => {
		let isLoggedIn = false
		await auth.onAuthStateChanged(async function (user) {
			console.log( 'user---', user)
			if (user) {
				isLoggedIn =  true
			}
		});
		return isLoggedIn;
  };

	/**ログアウト */
	const logout = () => {
		auth.signOut().then(() => {
			window.location.reload();
		});
	};


    return {signIn, signUp, isLoggedIn, logout}
}
