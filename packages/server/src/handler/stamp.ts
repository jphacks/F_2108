import { FastifyInstance } from "fastify"
import { ResponseBody } from "../util/schema"
import { Comment, CommentDataType } from "../entity/Comment"
import { Stamp } from "../entity/Stamp"
import { connection } from "../index"
import { File } from "../entity/File"
import {
  buildCommentResponse,
  buildStampResponse,
} from "../util/responseBuilders"
import { MultipartFile, MultipartValue } from "fastify-multipart"
import { buildComment } from "./comment"
import { registerFirebaseAuth } from "../util/auth"

export const stampHandler = async (server: FastifyInstance) => {
  await registerFirebaseAuth(server)

  server.post<{
    Params: { fileId: string }
    Body: {
      page: MultipartValue<number>
      x: MultipartValue<number>
      y: MultipartValue<number>
      dataType: MultipartValue<CommentDataType>
      content: MultipartValue<string> | MultipartFile
      title?: MultipartValue<string>
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
    stamp.author = server.currentUser()
    stamp.file = file

    const comment = await buildComment(
      server.storage(),
      body.dataType.value,
      server.currentUser(),
      stamp,
      body.content,
      body.title?.value,
    )

    const result = await connection.transaction<{
      stamp: Stamp
      comment: Comment
    }>(async (manager) => {
      const stampResult = await manager.save(stamp)
      const commentResult = await manager.save(comment)

      return { stamp: stampResult, comment: commentResult }
    })

    const stampResponse = await buildStampResponse(result.stamp, false)
    const commentResponse = buildCommentResponse(result.comment)

    res.send({
      result: "success",
      data: {
        ...stampResponse,
        comments: [commentResponse],
      },
    })
  })
}
