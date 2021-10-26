import { User } from "@domain/user"

export type Comment = AudioComment | TextComment

export type AudioComment = {
  id: number
  dataType: "audio"
  content: string
  author: User
  postedAt: string
  title: string
}

export type TextComment = {
  id: number
  dataType: "audio"
  content: string
  author: User
  postedAt: string
  title?: undefined
}
