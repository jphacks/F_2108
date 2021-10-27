import Image from "next/image"

export type ListElementProps = {
  name: string
  thumbnail: string
  editUser: string
  editDate: string
  nextPage: () => void
}

/**
 * ListElement
 * @param name ファイル名
 * @param thumbnail リストサムネイル
 * @param editUser 編集者
 * @param editDate 編集日
 * @param nextPage 詳細ページへ遷移(次ページにquery渡す)
 */

export const ListElement: React.VFC<ListElementProps> = ({
  name,
  thumbnail,
  editDate,
  editUser,
  nextPage,
}) => {
  return (
    <button onClick={nextPage}>
      <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm">
        <a href="#">
          <Image
            src={thumbnail}
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
              <p className="text-gray-900 font-bold tracking-tight mb-2 mt-2">
                {name}
              </p>
            </div>
          </div>
          <p className="font-normal text-gray-700 mb-3 mt-3">
            {editUser} が {editDate} に編集
          </p>
        </div>
      </div>
    </button>
  )
}
