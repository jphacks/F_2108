import { FastifyInstance } from "fastify"
import { ResponseBody } from "../util/schema"
import { connection } from "../index"
import { File } from "../entity/File"
import createError from "fastify-error"
import { ERR_BAD_URL } from "../util/errors"
import {
  buildFileResponse,
  buildStampResponse,
  buildUserResponse,
} from "../util/responseBuilders"

export const fileDetailHandler = async (server: FastifyInstance) => {
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

      if (req.currentUser) {
        file.shared_to = [req.currentUser]
      }
      await repository.save(file)

      const stamps = await file.stamps
      const stampsResponse = await Promise.all(
        stamps.map((s) => buildStampResponse(s)),
      )

      res.send({
        result: "success",
        data: {
          fileSnapshot: {
            type: req.currentUser ? file.fileType(req.currentUser) : "shared",
            file: buildFileResponse(file),
            updatedAt: file.updated_at,
            updatedBy: buildUserResponse(file.updated_by),
          },
          stamps: stampsResponse,
        },
      })
    },
  )
}
