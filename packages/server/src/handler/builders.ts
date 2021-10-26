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
  comments: CommentResponse[]
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

export const buildFile = (file: File): FileResponse => ({
  id: file.file_id,
  author: buildUser(file.author),
  name: file.name,
  postedAt: file.posted_at,
  url: file.url,
  thumbnail: file.thumbnail,
})

export const buildUser = (user: User): UserResponse => ({
  id: user.user_id,
  name: user.name,
  iconUrl: user.icon_url,
})

export const buildStamp = (stamp: Stamp): StampResponse => ({
  id: stamp.stamp_id,
  author: buildUser(stamp.author),
  comments: stamp.comments.map(buildComment),
  position: {
    page: stamp.position_page,
    x: stamp.position_x,
    y: stamp.position_y,
  },
})

export const buildComment = (comment: Comment): CommentResponse => ({
  id: comment.comment_id,
  dateType: comment.data_type,
  content: comment.content,
  author: buildUser(comment.author),
  postedAt: comment.posted_at,
})
