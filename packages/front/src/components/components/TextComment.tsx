import { Icon } from "@components/atoms/Icon"
import { TextComment as TextCommentType } from "@domain/comment"
import React from "react"

export type TextCommentProps = {
  comment: TextCommentType
  onPlayEnd?: () => void
}

export const TextComment: React.VFC<TextCommentProps> = ({ comment }) => {
  return (
    <section className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <Icon user={comment.author} size={40} />
      </div>
      <div className="px-4 py-2 text-xs text-black bg-white rounded-xl">
        <p>{comment.content}</p>
      </div>
    </section>
  )
}
