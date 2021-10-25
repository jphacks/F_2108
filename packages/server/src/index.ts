import Fastify from "fastify"
import { Connection, createConnection } from "typeorm"
import * as process from "process"
import { File } from "./entity/File"
import { ormconfig } from "./config/ormconfig"

const server = Fastify()

export let connection: Connection
createConnection(ormconfig).then((c) => (connection = c))

server.get("/file", async (req, res) => {
  const file = new File()
  file.name = "sample document"

  const repository = connection.getRepository(File)
  const files = await repository.find()

  return {
    result: "success",
    data: {
      files: files.map((f) => ({
        id: f.id,
        name: f.name,
      })),
    },
  }
})

server.post("/file", async (req, res) => {
  const file = new File()
  file.name = "awesome file"

  const repository = connection.getRepository(File)
  const created = await repository.save(file)

  return {
    result: "success",
    data: {
      file: {
        id: created.id,
        name: created.name,
      },
    },
  }
})

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
