import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Toast, ToastType } from "@components/components/toast"
import { FileData } from "@domain/fileData"

export type UrlShareProps = {
  file: FileData
}

/**
 * URLシェアコンポーネント
 */

const UrlShare: React.VFC<UrlShareProps> = ({ file }) => {
  const [toastMessage, setToastMessage] = useState<string>("")
  const [toastType, setToastType] = useState<ToastType>(ToastType.Notification)
  const [toastState, setToastState] = useState<boolean>(false)
  const [url, setUrl] = useState<string>("")
  const router = useRouter()

  /**
   * OS の Clipboard にテキストを書き込む
   * @param text URL
   * @return void
   */
  const copyToClipboard = (text: string): Promise<void> => {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text)
    }

    const textarea = document.createElement("textarea")
    textarea.style.position = "absolute"
    textarea.style.top = "-1000px"
    textarea.innerText = text
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand("copy")
    } catch (error) {
      Promise.reject(error)
      setToastType(ToastType.Error)
      setToastMessage(error.message)
      setToastState(true)
      console.error(error)
    }
    document.body.removeChild(textarea)
    return Promise.resolve()
  }

  const handleNewLineString = (message: string | null): JSX.Element[] => {
    if (!message) {
      return []
    }
    const newLineString = message
      .split(/(\n)/)
      .map((str, index) => (
        <React.Fragment key={index}>
          {str.match(/\n/) ? <br /> : str}
        </React.Fragment>
      ))
    return newLineString
  }

  //シェア用のURLを取得
  const getShareUrl = (): string => {
    return location.protocol + "//" + location.host + "/" + file.id
  }

  useEffect(() => {
    setUrl(getShareUrl())
  }, [router])

  return (
    <div>
      <Toast
        type={toastType}
        text={toastMessage}
        isShow={toastState}
        isShowSetter={setToastState}
      />
      <section className="w-full p-10 mx-auto bg-black rounded-2xl shadow-paper">
        <div className="text-2xl font-bold text-center text-white">
          共有リンクURL
        </div>
        <div className="mt-2 text-base text-center text-white">
          このURLを知っている人は誰でも閲覧できます
        </div>
        <div className="flex items-center py-2 pr-2 mt-4 bg-white border rounded-lg">
          <input className="w-full px-2 text-gray-400" disabled value={url} />
          <button
            onClick={() => {
              copyToClipboard(url).then(() => {
                setToastType(ToastType.Notification)
                setToastMessage("URLをコピーしました")
                setToastState(true)
              })
            }}
            className={
              "bg-primary flex rounded-lg my-0.7 mr-0.7 ml-auto h-10 items-center min-w-max px-3 py-2"
            }
          >
            <span className="text-xs ml-0.5 font-bold">
              {handleNewLineString("共有リンクを\nコピーする")}
            </span>
          </button>
        </div>
      </section>
    </div>
  )
}

export default UrlShare
