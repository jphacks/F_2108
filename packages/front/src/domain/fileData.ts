import { User } from "@domain/user"

export type FileData = {
  id: string
  author: User
  postedAt: string
  url: string
  thumbnail: string
}
