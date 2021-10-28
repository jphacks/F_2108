import { FileDataSnapshot } from "@domain/fileDataSnapshot"
import Link from "next/link"
import Image from "next/image"
import React from "react"

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
  return (
    <Link href={`/${file.file.id}`}>
      <a>
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md">
          <a href="#">
            <Image
              src={file.file.thumbnail}
              width={200}
              height={100}
              className="object-cover pointer-events-none"
            />
          </a>
          <div className="p-5">
            <div className="flex">
              <Image
                src="/play.png"
                width={35}
                height={10}
                className="pointer-events-none"
              />
              <div className="flex items-center ml-2">
                <p className="mt-2 mb-2 font-bold tracking-tight text-gray-900">
                  {file.file.name}
                </p>
              </div>
            </div>
            <p className="mt-3 mb-3 font-normal text-gray-700">
              {file.updatedBy != null
                ? `${file.updatedBy?.name} が ${file.updatedAt} に編集`
                : `${file.file.author.name} が ${file.file.postedAt} に編集`}
            </p>
          </div>
        </div>
      </a>
    </Link>
  )
}
