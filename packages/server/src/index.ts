import Fastify, { FastifyError } from "fastify"
import { Connection, createConnection } from "typeorm"
import * as process from "process"
import { ormconfig } from "./config/ormconfig"
import { fileHandler } from "./handler/file"
import fastifyMultipart from "fastify-multipart"
import { ResponseBody } from "./util/schema"
import { stampHandler } from "./handler/stamp"
import { commentHandler } from "./handler/comment"
import { initializeApp } from "./util/auth"
import { registerStorage } from "./storage/register"
import cors from "fastify-cors"

export let connection: Connection

if (process.env.AUTH !== "false") {
  initializeApp()
}

const server = Fastify()

server.register(cors, {
  origin: ["http://localhost:3000", process.env.CORS_ORIGIN ?? ""],
  credentials: true,
})
registerStorage(server)
server.register(fastifyMultipart, { attachFieldsToBody: true })

server.get("/health", async (_, res) => res.send("ok"))
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
    const PORT = process.env.APP_PORT || 3000
    await server.listen(PORT, "0.0.0.0")
    console.log(`listening localhost:${PORT}`)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
start()
