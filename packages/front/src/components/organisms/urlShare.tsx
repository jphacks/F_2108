import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Toast, ToastType } from "@components/components/toast"

/**
 * URLシェアコンポーネント
 * props無し。独自にURLを取得してきてクリップボードにコピーするコンポーネント
 */

const UrlShare: React.VFC = () => {
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
    return location.protocol + "//" + location.host + router.pathname
  }

  useEffect(() => {
    setUrl(getShareUrl)
  }, [router])

  return (
    <div>
      <Toast
        type={toastType}
        text={toastMessage}
        isShow={toastState}
        isShowSetter={setToastState}
      />
      <section className="mx-auto w-1/3 bg-black rounded-2xl p-10 shadow-paper">
        <div className="text-center font-bold text-2xl text-white">
          共有リンクURL
        </div>
        <div className="text-center text-base mt-2 text-white">
          このURLを知っている人は誰でも閲覧できます
        </div>
        <div className="flex bg-white border rounded-lg items-center p-2 mt-4">
          <p className="overflow-ellipsis overflow-hidden whitespace-nowrap text-gray-400">
            {url}
          </p>
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
