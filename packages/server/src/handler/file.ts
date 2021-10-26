import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRegisterOptions,
} from "fastify"
import { File } from "../entity/File"
import { connection } from "../index"

export const fileHandler = async (
  server: FastifyInstance,
  options: FastifyRegisterOptions<FastifyPluginOptions>,
) => {
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
}
