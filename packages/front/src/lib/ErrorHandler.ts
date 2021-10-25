import { HttpError } from "@lib/exception/HttpError"
import { NetworkError } from "@lib/exception/NetworkError"

export const errorHandler = ({
  error,
  alertMessage,
}: {
  error: Error
  alertMessage?: string
}): never => {
  const wrappedAlert = (message: string) => alert(alertMessage || message)

  if (error instanceof HttpError) {
    switch (error.status) {
      case 404:
        location.href = "/404"
        wrappedAlert("ページが見つかりませんでした。")
        throw error

      case 500:
        location.href = "/500"
        wrappedAlert("サーバーエラーが発生しました。")
        throw error

      default:
        wrappedAlert("エラーが発生しました。")
        throw error
    }
  }

  if (error instanceof NetworkError) {
    wrappedAlert(
      "ネットワークエラーが発生しました。通信状況をお確かめください。",
    )
    throw error
  }

  wrappedAlert("エラーが発生しました。")
  throw error
}
