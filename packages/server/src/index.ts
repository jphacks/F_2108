import Fastify from "fastify"
import { Connection, createConnection } from "typeorm"
import * as process from "process"
import { ormconfig } from "./config/ormconfig"
import { fileHandler } from "./handler/file"

const server = Fastify()

export let connection: Connection
createConnection(ormconfig).then((c) => (connection = c))

server.register(fileHandler)

const start = async () => {
  try {
    const PORT = process.env.PORT || 3000
    await server.listen(PORT, "0.0.0.0")
    console.log(`listening localhost:${PORT}`)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
start()
