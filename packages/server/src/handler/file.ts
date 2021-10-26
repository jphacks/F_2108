import { FastifyInstance } from "fastify"
import { File } from "../entity/File"
import { connection, dummyUser } from "../index"
import { LocalStorage } from "../storage/LocalStorage"
import { MultipartFile, MultipartValue } from "fastify-multipart"
import { ResponseBody } from "../util/schema"
import { buildFile, buildStamp, buildUser } from "../util/builders"
import createError from "fastify-error"
import { ERR_BAD_URL } from "../util/errors"

export const fileHandler = async (server: FastifyInstance) => {
  server.get<{ Reply: ResponseBody }>("/file", async (req, res) => {
    const repository = connection.getRepository(File)

    // TODO: find only own and shared files
    const files = await repository.find()

    res.send({
      result: "success",
      data: files.map((f) => ({
        type: f.fileType(dummyUser),
        file: buildFile(f),
        updatedAt: f.updated_at,
        updatedBt: buildUser(f.updated_by),
      })),
    })
  })

  server.get<{ Params: { fileId: string }; Reply: ResponseBody }>(
    "/file/:fileId",
    async (req, res) => {
      const fileId = req.params.fileId

      const query = connection.getRepository(File).createQueryBuilder("file")

      const file = await query
        .innerJoinAndSelect("file.author", "file_author")
        .innerJoinAndSelect("file.updated_by", "file_updated_by")
        .leftJoinAndSelect("file.stamps", "stamp")
        .innerJoinAndSelect("stamp.author", "stamp_author")
        .leftJoinAndSelect("stamp.comments", "comment")
        .innerJoinAndSelect("comment.author", "comment_author")
        .where("file.file_id = :fileId", { fileId })
        .getOne()

      if (!file) {
        const e = createError(
          ERR_BAD_URL,
          `File(${fileId}) was not found.`,
          404,
        )
        throw new e()
      }

      const stamps = await file.stamps
      const stampsResponse = await Promise.all(stamps.map((s) => buildStamp(s)))

      res.send({
        result: "success",
        data: {
          fileSnapshot: {
            type: file.fileType(dummyUser),
            file: buildFile(file),
            updatedAt: file.updated_at,
            updatedBy: buildUser(file.updated_by),
          },
          stamps: stampsResponse,
        },
      })
    },
  )

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
    fileModel.thumbnail = "dummy-thumbnail-url" // TODO: create thumbnail and pass its url
    fileModel.author = dummyUser
    fileModel.updated_by = dummyUser

    const repository = connection.getRepository(File)
    const result = await repository.save(fileModel)

    res.send({
      result: "success",
      data: {
        type: "own",
        file: buildFile(fileModel),
        updatedAt: result.updated_at,
        updatedBy: buildUser(result.updated_by),
      },
    })
  })
}
