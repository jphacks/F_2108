import { Position } from "postcss"
import { User } from "./user"

export type Stamp = {
  id: number
  author: User
  comments: Comment[]
  position: Position
}
