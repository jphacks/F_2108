import { User } from "../entity/User"
import { File } from "../entity/File"
import { Comment, CommentDataType } from "../entity/Comment"
import { Stamp } from "../entity/Stamp"

type FileResponse = {
  id: string
  author: UserResponse
  name: string
  postedAt: Date
  url: string
  thumbnail: string
}

type UserResponse = { id: string; name: string; iconUrl: string }

type StampResponse = {
  id: number
  author: UserResponse
  comments?: CommentResponse[]
  position: {
    page: number
    x: number
    y: number
  }
}

type CommentResponse = {
  id: number
  dateType: CommentDataType
  content: string
  author: UserResponse
  postedAt: Date
}

export const buildFileResponse = (file: File): FileResponse => ({
  id: file.id,
  author: buildUserResponse(file.author),
  name: file.name,
  postedAt: file.posted_at,
  url: file.url,
  thumbnail: file.thumbnail,
})

export const buildUserResponse = (user: User): UserResponse => ({
  id: user.id,
  name: user.name,
  iconUrl: user.icon_url,
})

export const buildStampResponse = async (
  stamp: Stamp,
  withComments = true,
): Promise<StampResponse> => {
  const stampResponse: StampResponse = {
    id: stamp.id,
    author: buildUserResponse(stamp.author),
    position: {
      page: stamp.position_page,
      x: stamp.position_x,
      y: stamp.position_y,
    },
  }

  if (withComments) {
    const comments = await stamp.comments
    stampResponse.comments = comments.map(buildCommentResponse)
  }

  return stampResponse
}

export const buildCommentResponse = (comment: Comment): CommentResponse => ({
  id: comment.id,
  dateType: comment.data_type,
  content: comment.content,
  author: buildUserResponse(comment.author),
  postedAt: comment.posted_at,
})
