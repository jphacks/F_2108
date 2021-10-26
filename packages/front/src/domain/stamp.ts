import { Position } from "postcss"
import { User } from "@domain/user"

export type Stamp = {
  id: number
  author: User
  comments: Comment[]
  position: Position
}
