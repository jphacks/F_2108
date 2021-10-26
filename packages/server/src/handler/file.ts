import { FastifyInstance } from "fastify"
import { File } from "../entity/File"
import { connection, dummyUser } from "../index"
import { LocalStorage } from "../storage/LocalStorage"
import { MultipartFile, MultipartValue } from "fastify-multipart"
import { ResponseBody } from "./schema"
import { buildUser } from "./builders"

export const fileHandler = async (server: FastifyInstance) => {
  server.get<{ Reply: ResponseBody }>("/file", async (req, res) => {
    const repository = connection.getRepository(File)

    // TODO: find only own and shared files
    const files = await repository.find()

    res.send({
      result: "success",
      data: files.map((f) => ({
        type: f.fileType(dummyUser),
        file: {
          id: f.file_id,
          author: buildUser(f.author),
          name: f.name,
          postedAt: f.posted_at,
          url: f.url,
          thumbnail: f.thumbnail,
        },
        updatedAt: f.updated_at,
        updatedBt: buildUser(f.updated_by),
      })),
    })
  })

  server.post<{
    Body: { name: MultipartValue<string>; file: MultipartFile }
    Reply: ResponseBody
  }>("/file", async (req, res) => {
    const file = req.body.file
    const buffer = await file.toBuffer()
    const filename = file.filename

    const storage = new LocalStorage()
    const { url } = await storage.save("file", filename, buffer)

    const fileModel = new File()
    fileModel.name = req.body.name.value
    fileModel.url = url
    fileModel.thumbnail = "not thumbnail" // TODO: create thumbnail and pass its url
    fileModel.author = dummyUser
    fileModel.updated_by = dummyUser

    const repository = connection.getRepository(File)
    const result = await repository.save(fileModel)

    res.send({
      result: "success",
      data: {
        type: "own",
        file: {
          id: result.file_id,
          author: buildUser(result.author),
          name: result.name,
          postedAt: result.posted_at,
          url: result.url,
          thumbnail: result.thumbnail,
        },
        updatedAt: result.updated_at,
        updatedBy: buildUser(result.updated_by),
      },
    })
  })
}
