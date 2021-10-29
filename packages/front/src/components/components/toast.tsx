import React, { useEffect } from "react"
import { ToastProvider, useToasts } from "react-toast-notifications"

export enum ToastType {
  Notification,
  Error,
}

type Props = {
  type: ToastType
  text: string
  isShow: boolean
  isShowSetter: Function
}

/**
 * Modalを表示させる
 * @param type: おしらせ（緑）かエラー（赤）
 * @param text: トーストの内容
 * @param isShow: トーストが見える状態か
 * @param isShowSetter: トーストの状態を戻すセッター
 */
export const Toast: React.FC<Props> = ({
  type,
  text,
  isShow,
  isShowSetter,
}) => {
  const Logic: React.FC<Props> = ({ type, text, isShow, isShowSetter }) => {
    const { addToast } = useToasts()

    const successHandler = () => {
      addToast(text, {
        appearance: "success",
        autoDismiss: true,
      })
    }

    const errorHandler = () => {
      addToast(text, {
        appearance: "error",
        autoDismiss: true,
      })
    }

    const stateHandler = (type: ToastType) => {
      switch (type) {
        case ToastType.Notification:
          successHandler()
          break
        case ToastType.Error:
          errorHandler()
          break
      }
      isShowSetter(false)
    }

    useEffect(() => {
      if (isShow) stateHandler(type)
    }, [isShow])

    return <></>
  }

  return (
    <ToastProvider>
      <Logic
        type={type}
        text={text}
        isShow={isShow}
        isShowSetter={isShowSetter}
      />
    </ToastProvider>
  )
}
