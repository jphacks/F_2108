import { User } from "@domain/user"

export type Comment = {
  id: string
  dataType: "audio" | "text"
  content: string
  author: User
  postedAt: string
  title: string
}
