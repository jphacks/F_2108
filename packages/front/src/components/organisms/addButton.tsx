import Image from "next/image"

export type AddButtonProps = {
  onClick: () => void
}

/**
 * ListElement
 * @param onClick 新規ファイルアップロードモーダルのトリガー
 */

export const AddButton: React.VFC<AddButtonProps> = ({ onClick }) => {
  return (
    <button
      className="bg-yellow-300 border rounded-lg py-4 px-6 mr-2 flex items-center"
      onClick={onClick}
    >
      <Image src="/add.png" width={25} height={25} />
      <div className="ml-2">新規</div>
    </button>
  )
}
