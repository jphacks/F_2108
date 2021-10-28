import { FastifyInstance } from "fastify"
import fastifyBearerAuth from "fastify-bearer-auth"
import * as admin from "firebase-admin"
import { auth } from "firebase-admin"
import { User } from "../entity/User"
import { connection } from "../index"
import DecodedIdToken = auth.DecodedIdToken
import process from "process"

export const registerFirebaseAuth = async (server: FastifyInstance) => {
  if (process.env.AUTH === "false") {
    const dummyUser = new User()
    dummyUser.id = "dummyuserid"
    dummyUser.name = "dummy user"
    dummyUser.icon_url =
      User.ICON_URL_PREFIX + User.ADMIN_ICON_URL_PREFIX + "/dummy_user.png"

    server.decorate("currentUser", () => dummyUser)
    return
  }

  await server.register(fastifyBearerAuth, {
    keys: new Set<string>(), // this is ignored
    auth: async (key) => {
      let decoded: DecodedIdToken
      try {
        decoded = await admin.auth().verifyIdToken(key)
      } catch (e) {
        console.error(e)
        return false
      }

      const uid = decoded.uid
      const userRecord = await admin.auth().getUser(uid)

      const user = new User()
      user.id = uid
      user.name = userRecord.displayName ?? User.NO_NAME
      user.icon_url = userRecord.photoURL ?? User.NO_PHOTO_URL

      const repository = connection.getRepository(User)
      await repository.save(user)

      server.decorate("currentUser", () => user)

      return true
    },
  })
}

export const initializeApp = () => {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // 改行文字を表す文字列を改行文字に変換
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}
