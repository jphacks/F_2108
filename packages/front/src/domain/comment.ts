import { User } from "@domain/user"

export type Comment = AudioComment | TextComment

export type AudioComment = {
  id: string
  dataType: "audio"
  content: string
  author: User
  postedAt: string
  title: string
}

export type TextComment = {
  id: string
  dataType: "text"
  content: string
  author: User
  postedAt: string
  title?: undefined
}
