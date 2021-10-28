import { FastifyInstance } from "fastify"
import { ResponseBody } from "../util/schema"
import { Comment, CommentDataType } from "../entity/Comment"
import { MultipartFile, MultipartValue } from "fastify-multipart"
import { File } from "../entity/File"
import { Stamp } from "../entity/Stamp"
import { connection } from "../index"
import { buildCommentResponse } from "../util/responseBuilders"
import createError from "fastify-error"
import { ERR_INVALID_PAYLOAD } from "../util/errors"
import { User } from "../entity/User"
import { registerFirebaseAuth } from "../util/auth"
import { IStorage } from "../storage/IStorage"

export const commentHandler = async (server: FastifyInstance) => {
  await registerFirebaseAuth(server)

  server.post<{
    Params: { fileId: string; stampId: number }
    Body: {
      dataType: MultipartValue<CommentDataType>
      content: MultipartValue<string> | MultipartFile
      title?: MultipartValue<string>
    }
    Reply: ResponseBody
  }>("/file/:fileId/stamp/:stampId/comment", async (req, res) => {
    const { body, params } = req

    const file = new File()
    file.id = params.fileId

    const stamp = new Stamp()
    stamp.id = params.stampId

    const comment = await buildComment(
      server.storage(),
      body.dataType.value,
      server.currentUser(),
      stamp,
      body.content,
      body.title?.value,
    )

    const repository = connection.getRepository(Comment)
    const result = await repository.save(comment)

    res.send({
      result: "success",
      data: {
        ...buildCommentResponse(result),
      },
    })
  })
}

export const buildComment = async (
  storage: IStorage,
  dataType: CommentDataType,
  author: User,
  stamp: Stamp,
  content: MultipartValue<string> | MultipartFile,
  title?: string,
): Promise<Comment> => {
  const comment = new Comment()
  comment.data_type = dataType
  comment.author = author
  comment.stamp = stamp

  switch (dataType) {
    // save text file
    case CommentDataType.TEXT:
      comment.content = (content as MultipartValue<string>).value
      break

    // save audio file
    case CommentDataType.AUDIO: {
      const audio = content as MultipartFile
      const filename = audio.filename
      if (!filename) {
        const e = createError(
          ERR_INVALID_PAYLOAD,
          "`content` must be sent.",
          400,
        )
        throw new e()
      }
      const buffer = await audio.toBuffer()

      const { url } = await storage.save("audio", filename, buffer)
      comment.content = url

      if (title) comment.title = title

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

  return comment
}
