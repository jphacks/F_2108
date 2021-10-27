import React, { useEffect } from "react"

type Props = {
  title?: string
  detail?: JSX.Element
  body: JSX.Element
  isOpen: boolean
  onClick: () => void
}

/**
 * モーダルコンポーネント
 * @param title タイトル
 * @param detail 詳細
 * @param body 表示内容
 * @param isOpen モーダルの開閉状態
 * @param onClick ハンドラ
 */

export const Modal: React.VFC<Props> = ({
  title,
  detail,
  body,
  isOpen = false,
  onClick,
}) => {
  const bgClass = "fixed top-0 left-0 bottom-0 right-0 z-0".split(" ")

  useEffect(() => {
    if (isOpen) {
      for (const bgClassName of bgClass) {
        document.getElementById("app")?.classList.add(bgClassName)
      }
    } else {
      for (const bgClassName of bgClass) {
        document.getElementById("app")?.classList.remove(bgClassName)
      }
    }
  }, [isOpen])

  return isOpen ? (
    <div>
      <div
        className="fixed bg-black opacity-40 w-full h-full top-0 left-0 z-30"
        onClick={() => onClick()}
      />
      <div className="fixed bg-white w-2/3 rounded-lg top-2/4 left-2/4 transform -translate-y-2/4 -translate-x-2/4 z-50">
        <button
          className="sticky text-4xl mr-3 ml-auto block"
          onClick={() => onClick()}
        >
          ×
        </button>
        <div className="flex flex-col justify-center mx-auto overflow-y-auto h-auto mb-5">
          <div className="max-h-7/10-screen w-5/6 mx-auto py-5">
            {title && <div className="font-bold text-center">{title}</div>}
            {detail && <div className="text-sm pt-5 pb-7">{detail}</div>}
            <div>{body}</div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div />
  )
}
