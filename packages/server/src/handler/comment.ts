import { FastifyInstance } from "fastify"
import { ResponseBody } from "../util/schema"
import { Comment, CommentDataType } from "../entity/Comment"
import { MultipartFile, MultipartValue } from "fastify-multipart"
import { File } from "../entity/File"
import { Stamp } from "../entity/Stamp"
import { connection, dummyUser } from "../index"
import { LocalStorage } from "../storage/LocalStorage"
import { buildComment } from "../util/builders"

export const commentHandler = async (server: FastifyInstance) => {
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

    const comment = new Comment()
    const dataType = body.dataType.value
    comment.data_type = dataType
    comment.author = dummyUser
    comment.stamp = stamp

    if (dataType === "text") {
      // save text file
      comment.content = (body.content as MultipartValue<string>).value
    } else {
      // save audio file
      const content = body.content as MultipartFile
      const filename = content.filename
      const buffer = await content.toBuffer()

      const storage = new LocalStorage()
      const { url } = await storage.save("audio", filename, buffer)
      comment.content = url
    }

    const repository = connection.getRepository(Comment)
    const result = await repository.save(comment)

    res.send({
      result: "success",
      data: {
        ...buildComment(result),
      },
    })
  })
}
