import type firebase from 'firebase/auth';

export type Action =
  { type: 'login', payload: { user: firebase.User }} |
  { type: 'logout', payload: { user: firebase.User }}

const initialState = null

const reducer = (state: firebase.User | null, action: Action) => {
  switch (action.type) {
    case "login":
      return action.payload.user
    case "logout":
      return initialState
    default:
      return state
  }
}

export default {
  initialState,
  reducer,
}