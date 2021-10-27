import { FastifyInstance } from "fastify"
import { ResponseBody } from "../util/schema"
import { Comment, CommentDataType } from "../entity/Comment"
import { Stamp } from "../entity/Stamp"
import { connection, dummyUser } from "../index"
import { File } from "../entity/File"
import { buildComment, buildStamp } from "../util/builders"
import { MultipartFile, MultipartValue } from "fastify-multipart"
import { LocalStorage } from "../storage/LocalStorage"
import createError from "fastify-error"
import { ERR_INVALID_PAYLOAD } from "../util/errors"

export const stampHandler = async (server: FastifyInstance) => {
  server.post<{
    Params: { fileId: string }
    Body: {
      page: MultipartValue<number>
      x: MultipartValue<number>
      y: MultipartValue<number>
      dataType: MultipartValue<CommentDataType>
      content: MultipartValue<string> | MultipartFile
    }
    Reply: ResponseBody
  }>("/file/:fileId/stamp", async (req, res) => {
    const body = req.body

    const file = new File()
    file.id = req.params.fileId

    const stamp = new Stamp()
    stamp.position_page = body.page.value
    stamp.position_x = body.x.value
    stamp.position_y = body.y.value
    stamp.author = dummyUser
    stamp.file = file

    const comment = new Comment()
    const dataType = body.dataType.value
    comment.data_type = dataType
    comment.author = dummyUser
    comment.stamp = stamp

    switch (dataType) {
      // save text file
      case CommentDataType.TEXT: {
        comment.content = (body.content as MultipartValue<string>).value
        break
      }

      // save audio file
      case CommentDataType.AUDIO: {
        const content = body.content as MultipartFile
        const filename = content.filename
        if (!filename) {
          const e = createError(
            ERR_INVALID_PAYLOAD,
            "`content` must be sent.",
            400,
          )
          throw new e()
        }
        const buffer = await content.toBuffer()

        const storage = new LocalStorage()
        const { url } = await storage.save("audio", filename, buffer)
        comment.content = url

        break
      }

      default: {
        const e = createError(
          ERR_INVALID_PAYLOAD,
          `\`dataType\` is invalid. Specify ${CommentDataType.AUDIO} or ${CommentDataType.TEXT}`,
          400,
        )
        throw new e()
      }
    }

    const result = await connection.transaction<{
      stamp: Stamp
      comment: Comment
    }>(async (manager) => {
      const stampResult = await manager.save(stamp)
      const commentResult = await manager.save(comment)

      return { stamp: stampResult, comment: commentResult }
    })

    const stampResponse = await buildStamp(result.stamp, false)
    const commentResponse = buildComment(result.comment)

    res.send({
      result: "success",
      data: {
        ...stampResponse,
        comments: [commentResponse],
      },
    })
  })
}
