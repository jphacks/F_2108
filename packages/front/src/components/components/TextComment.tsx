import { Icon } from "@components/atoms/Icon"
import { TextComment as TextCommentType } from "@domain/comment"
import React from "react"

export type TextCommentProps = {
  comment: TextCommentType
  onPlayEnd?: () => void
  /** コメントを描画する関数（主に検索結果表示時にハイライトするために利用） */
  contentRender?: (content: string) => React.ReactNode
}

export const TextComment: React.VFC<TextCommentProps> = ({
  comment,
  contentRender,
}) => {
  return (
    <section className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <Icon user={comment.author} size={40} />
      </div>
      <div className="px-4 py-2 text-xs text-black bg-white rounded-xl">
        <p>{contentRender?.(comment.content) ?? comment.content}</p>
      </div>
    </section>
  )
}
