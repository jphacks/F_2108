import { useEffect, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import workerSrc from "./pdf-worker"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import { Stamp } from "@domain/stamp"
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

export type PDFViewerProps = {
  /** 表示するPDFのURL */
  src: string
  /** スタンプのリスト */
  stamps: Stamp[]
  /** スタンプを描画する関数。stampsで与えた配列の要素を引数として受け取る */
  stampRender: (stamp: Stamp) => React.ReactNode
  /** ユーザーがスタンプ追加動作を行なった場合に呼ばれるコールバック */
  onStampAdd?: (page: number, x: number, y: number) => void
  width: number
}

export const PDFViewer: React.VFC<PDFViewerProps> = ({
  src,
  stamps,
  onStampAdd,
  stampRender,
  width,
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
        onLoadSuccess={(documentProxy) => setNumPages(documentProxy.numPages)}
        externalLinkTarget="_blank"
        className="space-y-4"
      >
        {Array.from({ length: numPages }, (_, index) => (
          <PdfPage
            key={`page_${index + 1}`}
            pageNum={index + 1}
            stamps={stamps.filter(
              ({ position: { page } }) => page === index + 1,
            )}
            stampRender={stampRender}
            width={width}
          />
        ))}
      </Document>
    </div>
  )
}

const PdfPage: React.VFC<{
  pageNum: number
  stamps: Stamp[]
  stampRender: PDFViewerProps["stampRender"]
  width?: number
}> = ({ pageNum, stamps, stampRender, width }) => {
  return (
    <div className="relative">
      <Page
        pageNumber={pageNum}
        renderAnnotationLayer={true}
        renderTextLayer={true}
        className="react-pdf-page-div shadow-paper"
        width={width}
        onLoadSuccess={(page) => console.log("getViewport", page.getViewport())}
      />
      {stamps.map((stamp) => (
        <div
          key={stamp.id}
          className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            top: `${stamp.position.y * 100}%`,
            left: `${stamp.position.x * 100}%`,
          }}
        >
          {stampRender(stamp)}
        </div>
      ))}
    </div>
  )
}
