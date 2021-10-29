import { FastifyInstance } from "fastify"
import { File } from "../entity/File"
import { connection } from "../index"
import { MultipartFile, MultipartValue } from "fastify-multipart"
import { ResponseBody } from "../util/schema"
import {
  buildFileResponse,
  buildStampResponse,
  buildUserResponse,
} from "../util/responseBuilders"
import createError from "fastify-error"
import { ERR_BAD_URL, ERR_INVALID_PAYLOAD } from "../util/errors"
import { registerFirebaseAuth } from "../util/auth"
import { User } from "../entity/User"

export const fileHandler = async (server: FastifyInstance) => {
  await registerFirebaseAuth(server)

  server.get<{ Reply: ResponseBody }>("/file", async (req, res) => {
    const repository = connection.getRepository(File)

    const currentUser = new User()
    currentUser.id = req.currentUser.id

    const files = await repository
      .createQueryBuilder("file")
      .innerJoinAndSelect("file.author", "author")
      .innerJoinAndSelect("file.updated_by", "updated_by")
      .leftJoin("file.shared_to", "shared_to")
      .where("file.author.id = :authorId", { authorId: currentUser.id })
      .orWhere("shared_to.id = :sharedToUserId", {
        sharedToUserId: currentUser.id,
      })
      .getMany()

    res.send({
      result: "success",
      data: files.map((f) => ({
        type: f.fileType(req.currentUser),
        file: buildFileResponse(f),
        updatedAt: f.updated_at,
        updatedBt: buildUserResponse(f.updated_by),
      })),
    })
  })

  server.get<{ Params: { fileId: string }; Reply: ResponseBody }>(
    "/file/:fileId",
    async (req, res) => {
      const fileId = req.params.fileId

      const repository = connection.getRepository(File)
      const query = repository.createQueryBuilder("file")

      const file = await query
        .innerJoinAndSelect("file.author", "file_author")
        .innerJoinAndSelect("file.updated_by", "file_updated_by")
        .leftJoinAndSelect("file.stamps", "stamp")
        .leftJoinAndSelect("stamp.author", "stamp_author")
        .leftJoinAndSelect("stamp.comments", "comment")
        .leftJoinAndSelect("comment.author", "comment_author")
        .where("file.id = :fileId", { fileId })
        .getOne()

      if (!file) {
        const e = createError(
          ERR_BAD_URL,
          `File(${fileId}) was not found.`,
          404,
        )
        throw new e()
      }

      file.shared_to = [req.currentUser]
      await repository.save(file)

      const stamps = await file.stamps
      const stampsResponse = await Promise.all(
        stamps.map((s) => buildStampResponse(s)),
      )

      res.send({
        result: "success",
        data: {
          fileSnapshot: {
            type: file.fileType(req.currentUser),
            file: buildFileResponse(file),
            updatedAt: file.updated_at,
            updatedBy: buildUserResponse(file.updated_by),
          },
          stamps: stampsResponse,
        },
      })
    },
  )

  server.post<{
    Body: { name: MultipartValue<string>; file: MultipartValue<string> }
    Reply: ResponseBody
  }>("/file", async (req, res) => {
    // const file = req.body.file
    // if (!file.filename) {
    //   const e = createError(ERR_INVALID_PAYLOAD, "`file` should be sent.", 400)
    //   throw new e()
    // }
    // const buffer = await file.toBuffer()
    // const filename = file.filename
    //
    // const { fileUrl, thumbnailUrl } = await server
    //   .storage()
    //   .save("file", filename, buffer)

    const fileModel = new File()
    fileModel.name = req.body.name.value
    // fileModel.url = fileUrl
    fileModel.url = req.body.file.value
    // fileModel.thumbnail =
    //   thumbnailUrl ?? "Thumbnail is generated only in production mode."
    fileModel.thumbnail = "Thumbnail is generated only when use s3."
    fileModel.author = req.currentUser
    fileModel.updated_by = req.currentUser

    const repository = connection.getRepository(File)
    const result = await repository.save(fileModel)

    res.send({
      result: "success",
      data: {
        type: "own",
        file: buildFileResponse(fileModel),
        updatedAt: result.updated_at,
        updatedBy: buildUserResponse(result.updated_by),
      },
    })
  })
}
