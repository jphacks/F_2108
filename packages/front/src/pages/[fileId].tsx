import React, { useState } from "react"
import { NextPage } from "next"
import dynamic from "next/dynamic"
import type { PDFViewerProps } from "@components/components/PdfViewer"
import IconPlayButton from "@components/organisms/IconPlayButton"
import Stamp from "@components/atoms/Stamp"
import { Stamp as StampModel } from "@domain/stamp"
import { useWindowSize } from "@hooks/useWindowSize"
const PDFViewer: React.ComponentType<PDFViewerProps> = dynamic(
  () =>
    import("../components/components/PdfViewer").then(
      (module) => module.PDFViewer,
    ),
  {
    ssr: false,
  },
)

const FileDetail: NextPage = () => {
  const [stamps, setStamps] = useState<StampModel[]>([
    {
      id: "0",
      author: {
        id: "qwerty",
        name: "joen doe",
        iconUrl: "/icons/icon01.png",
      },
      comments: [
        {
          id: "1",
          dataType: "audio",
          content: "http://example.com/audio",
          author: {
            id: "qwerty",
            name: "joen doe",
            iconUrl: "/icons/icon03.png",
          },
          postedAt: "2019-08-24T14:15:22Z",
          title: "タイトル",
        },
        {
          id: "2",
          dataType: "text",
          content: "コメント",
          author: {
            id: "qwerty",
            name: "joen doe",
            iconUrl: "/icons/icon02.png",
          },
          postedAt: "2019-08-25T14:15:22Z",
        },
      ],
      position: {
        page: 1,
        x: 0.3,
        y: 0.45,
      },
    },
  ])

  const { width } = useWindowSize()

  return (
    <div className="flex flex-col items-center w-full px-[10vw] py-8 bg-bgBlack/60">
      <PDFViewer
        src="/sample.pdf"
        stamps={stamps}
        onStampAdd={(page, x, y) => {
          console.log("add stamp")
          // setStamps((prev) => [...prev, { page, x, y, id: prev.length }])
        }}
        width={width * 0.6}
        stampRender={(stamp) => (
          <div className="relative">
            <Stamp stamp={stamp} />
            <div className="absolute w-40 text-sm bg-white border border-gray-400 rounded shadow-md left-full top-full hover:opacity-30">
              <div className="text-center">
                <span className="inline-block pointer-events-none">
                  (x, y) = ({stamp.position.x}, {stamp.position.y})
                </span>
                <br />
                <span className="inline-block pointer-events-none">
                  page = {stamp.position.page}
                </span>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  )
}

export default FileDetail
