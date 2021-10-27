import Fastify, { FastifyError } from "fastify"
import { Connection, createConnection } from "typeorm"
import * as process from "process"
import { ormconfig } from "./config/ormconfig"
import { fileHandler } from "./handler/file"
import fastifyMultipart from "fastify-multipart"
import { User } from "./entity/User"
import { ResponseBody } from "./util/schema"
import { stampHandler } from "./handler/stamp"
import { commentHandler } from "./handler/comment"
import fastifyBearerAuth from "fastify-bearer-auth"
import * as admin from "firebase-admin"
import { auth } from "firebase-admin"
import DecodedIdToken = auth.DecodedIdToken

export let connection: Connection

const server = Fastify()

server.register(fastifyMultipart, { attachFieldsToBody: true })

if (process.env.AUTH !== "false") {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // 改行文字を表す文字列を改行文字に変換
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })

  server.register(fastifyBearerAuth, {
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

      return true
    },
  })
}

server.register(fileHandler)
server.register(stampHandler)
server.register(commentHandler)

server.setErrorHandler<FastifyError, { Reply: ResponseBody }>((err, _, res) => {
  console.error(err)

  const status = err.statusCode || 500
  res.status(status).send({
    result: "error",
    data: { status, message: err.message },
  })
})

const start = async () => {
  try {
    connection = await createConnection(ormconfig)
    const PORT = process.env.PORT || 3000
    await server.listen(PORT, "0.0.0.0")
    console.log(`listening localhost:${PORT}`)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
start()
