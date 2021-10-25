import Fastify from "fastify"
import { Connection, createConnection } from "typeorm"
import * as process from "process"
import { File } from "./entity/File"

const server = Fastify()

export let connection: Connection
createConnection({
  type: "mysql",
  host: process.env.DB_HOST ?? "localhost",
  port: parseInt(process.env.DB_PORT ?? "3306"),
  username: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "db",
  entities: [__dirname + "/entity/*.ts"],
  synchronize: process.env.NODE_ENV === "development",
  logging: false,
}).then((c) => (connection = c))

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
