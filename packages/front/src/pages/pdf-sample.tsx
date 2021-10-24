import React, { useState } from "react"
import dynamic from "next/dynamic"
import type { PDFViewerProps } from "../components/PdfViewer"
import type { NextPage } from "next"

const PDFViewer: React.ComponentType<PDFViewerProps> = dynamic(
  () => import("../components/PdfViewer").then((module) => module.PDFViewer),
  {
    ssr: false,
  },
)

const pdf: NextPage = () => {
  const [stamps, setStamps] = useState<
    { page: number; x: number; y: number; id: number }[]
  >([])

  return (
    <div className="bg-gray-200">
      <h1>PDFViewerコンポーネントのサンプルのページです</h1>
      <p>
        PDF上でダブルクリックすることで、スタンプが追加されます。スタンプをクリックすることで削除が可能です。
      </p>
      <PDFViewer
        src="/sample.pdf"
        stamps={stamps}
        onStampAdd={(page, x, y) =>
          setStamps((prev) => [...prev, { page, x, y, id: prev.length }])
        }
        stampRender={({ x, y, page, id: targetId }) => (
          <div className="relative">
            <button
              className="w-4 h-4 bg-red-500 rounded-full"
              onClick={() =>
                setStamps((stamps) =>
                  stamps.filter(({ id }) => id !== targetId),
                )
              }
            />
            <div className="absolute w-40 text-sm bg-white border border-gray-400 rounded shadow-md left-full top-full hover:opacity-30">
              <div className="text-center">
                <span className="inline-block pointer-events-none">
                  (x, y) = ({x}, {y})
                </span>
                <br />
                <span className="inline-block pointer-events-none">
                  page = {page}
                </span>
              </div>
            </div>
          </div>
        )}
      ></PDFViewer>
    </div>
  )
}

export default pdf
