import { useEffect, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import workerSrc from "../pdf-worker"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

// FIXME: Modelが未実装なので暫定。Modelが完成し次第修正（yuta-ike）
export type Stamp = {
  page: number
  x: number
  y: number
  id: number
}

export type PDFViewerProps = {
  /** 表示するPDFのURL */
  src: string
  /** スタンプのリスト */
  stamps: Stamp[]
  /** スタンプを描画する関数。stampsで与えた配列の要素を引数として受け取る */
  stampRender: (stamp: Stamp) => React.ReactNode
  /** ユーザーがスタンプ追加動作を行なった場合に呼ばれるコールバック */
  onStampAdd?: (page: number, x: number, y: number) => void
}

export const PDFViewer: React.VFC<PDFViewerProps> = ({
  src,
  stamps,
  onStampAdd,
  stampRender,
}) => {
  const [numPages, setNumPages] = useState<number>(0)

  // NOTE: クリックイベントの追加
  useEffect(() => {
    if (onStampAdd == null) {
      return
    }
    const listeners: ((e: MouseEvent) => void)[] = []

    // refを指定できないのでクラス名でPageごとのdivを取得する
    const elements = document.querySelectorAll(
      ".react-pdf-page-div",
    ) as unknown as HTMLDivElement[]

    elements.forEach((element, index) => {
      // dbclickイベントをセットする
      const listener = (e: MouseEvent) => {
        const clientRect = element.getBoundingClientRect()
        const x = window.pageXOffset + clientRect.left
        const y = window.pageYOffset + clientRect.top
        onStampAdd(index + 1, e.pageX - x, e.pageY - y)
      }
      element.addEventListener("dblclick", listener)
      listeners[index] = listener
    })
    return () => {
      // dbclickイベントを除去する
      elements.forEach((element, index) => {
        const listener = listeners[index]
        if (listener != null) {
          element.removeEventListener("dblclick", listener)
        }
      })
    }
  }, [numPages, onStampAdd])

  return (
    <div className="relative flex">
      <Document
        file={src}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages)
        }}
        externalLinkTarget="_blank"
      >
        {Array.from({ length: numPages }, (_, index) => (
          <div className="relative" key={`page_${index + 1}`}>
            <Page
              pageNumber={index + 1}
              renderAnnotationLayer={true}
              renderTextLayer={true}
              className="react-pdf-page-div"
            />
            {stamps
              .filter(({ page }) => page === index + 1)
              .map(({ x, y, id }) => (
                <div
                  key={id}
                  className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ top: y, left: x }}
                >
                  {stampRender({ x, y, page: index + 1, id })}
                </div>
              ))}
          </div>
        ))}
      </Document>
    </div>
  )
}
