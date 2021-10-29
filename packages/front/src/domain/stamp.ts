import { Position } from "@domain/position"
import { User } from "@domain/user"
import { Comment } from "@domain/comment"

export type Stamp = {
  id: string
  author: User
  comments: Comment[]
  position: Position
}
