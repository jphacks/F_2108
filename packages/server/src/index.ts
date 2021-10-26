import Fastify, { FastifyError } from "fastify"
import { Connection, createConnection } from "typeorm"
import * as process from "process"
import { ormconfig } from "./config/ormconfig"
import { fileHandler } from "./handler/file"
import fastifyMultipart from "fastify-multipart"
import { User } from "./entity/User"
import { ResponseBody } from "./util/schema"
import { stampHandler } from "./handler/stamp"

export let connection: Connection

// TODO: this is dummy user for local demo
export const dummyUser = new User()
dummyUser.user_id = "abc"
dummyUser.name = "dummy user"
dummyUser.icon_url = "/user/icon/dummy.png"

const server = Fastify()

server.register(fastifyMultipart, { attachFieldsToBody: true })

server.register(fileHandler)
server.register(stampHandler)

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
