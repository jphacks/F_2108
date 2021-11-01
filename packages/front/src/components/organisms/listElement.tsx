import React, { useState } from "react"
import Link from "next/link"
import { FileDataSnapshot } from "@domain/fileDataSnapshot"
import { Play, Share } from "react-feather"
import { formatTime } from "@lib/formatTime"
import { Icon } from "@components/atoms/Icon"
import { useAuth } from "@hooks/useAuth"
import { UrlShareModal } from "./urlShareModal"
import { Thumbnail } from "@components/atoms/Thumbnail"

export type ListElementProps = {
  file: FileDataSnapshot
}

/**
 * ListElement
 * @param name ファイル名
 * @param thumbnail リストサムネイル
 * @param editUser 編集者
 * @param editDate 編集日
 * @param nextPage 詳細ページへ遷移(次ページにquery渡す)
 */
export const ListElement: React.VFC<ListElementProps> = ({ file }) => {
  const [openShareModal, setOpenShareModal] = useState(false)
  return (
    <>
      <div className="relative">
        <Link href={`/${file.file.id}`}>
          <a>
            <div className="flex flex-col w-full overflow-hidden bg-white border border-gray-300 border-solid rounded-lg hover:border-gray-400 hover:bg-gray-100 group">
              <div className="relative w-full h-[200px]">
                <Thumbnail file={file.file} />
                {file.type === "shared" && (
                  <span className="absolute bottom-0 right-0 px-1 py-0.5 m-2 text-xs font-bold text-white bg-blue-400 rounded">
                    共有されたファイル
                  </span>
                )}
              </div>
              <div className="px-5 py-3">
                <div className="flex items-center">
                  <div className="flex flex-col items-center justify-center p-2 bg-black rounded-full">
                    <Play
                      fill="white"
                      stroke="white"
                      className="translate-x-[1.5px]"
                      size={8}
                    />
                  </div>
                  <div className="flex items-center min-w-0 ml-2">
                    <p
                      className="mt-2 mb-2 font-bold leading-none tracking-tight text-gray-900 underline truncate transition text-decoration-transparent group-hover:text-decoration-auto"
                      title={file.file.name}
                    >
                      {file.file.name}
                    </p>
                  </div>
                </div>
                <div className="flex mt-1 ml-8">
                  <span className="inline-block mr-2">
                    <Icon user={file.updatedBy ?? file.file.author} size={24} />
                  </span>
                  <LastUpdateInfo file={file} />
                </div>
              </div>
            </div>
          </a>
        </Link>
        <div className="absolute top-0 right-0 m-4">
          <button
            className="p-2 transition bg-white border border-gray-300 border-solid rounded-full hover:bg-gray-100 hover:border-gray-400"
            onClick={() => setOpenShareModal(true)}
          >
            <Share size={16} />
          </button>
        </div>
      </div>
      <UrlShareModal
        open={openShareModal}
        onClose={() => setOpenShareModal(false)}
        file={file.file}
      />
    </>
  )
}

const LastUpdateInfo: React.VFC<{ file: FileDataSnapshot }> = ({ file }) => {
  const currentUser = useAuth()
  const userName =
    (file.updatedBy ?? file.file.author).id === currentUser?.uid
      ? "あなた"
      : `${file.updatedBy?.name ?? file.file.author.name}さん`
  const text =
    file.updatedBy != null
      ? `${userName}が ${formatTime(new Date(file.updatedAt))}に編集`
      : `${userName}が ${formatTime(new Date(file.file.postedAt))}に作成`

  return (
    <p
      className="text-sm font-normal leading-6 text-gray-500 truncate"
      title={text}
    >
      {text}
    </p>
  )
}
