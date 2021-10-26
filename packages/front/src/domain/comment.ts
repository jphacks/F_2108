import { User } from "./user"

export type Comment = {
  id: number
  dataType: "audio" | "text"
  content: string
  author: User
  postedAt: Date
}
