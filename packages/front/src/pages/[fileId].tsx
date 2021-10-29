import React, { useEffect, useState } from "react"
import { NextPage } from "next"
import Link from "next/link"
import dynamic from "next/dynamic"
import type { PDFViewerProps } from "@components/components/PdfViewer"
import Stamp from "@components/atoms/Stamp"
import { Stamp as StampModel } from "@domain/stamp"
import { useWindowSize } from "@hooks/useWindowSize"
import { Share, Plus, Minus, ArrowLeft } from "react-feather"
import { useRequest } from "@hooks/useRequest"
import { useFile } from "@hooks/useFile"
import { useRouter } from "next/router"
import { Comment } from "@domain/comment"
import { useAuth } from "@hooks/useAuth"
const PDFViewer: React.ComponentType<PDFViewerProps> = dynamic(
  () =>
    import("../components/components/PdfViewer").then(
      (module) => module.PDFViewer,
    ),
  {
    ssr: false,
    // TODO: loading表示
    // loading,
  },
)

type FileDetailQuery = {
  fileId: string
}

const FileDetail: NextPage<Record<string, never>, FileDetailQuery> = () => {
  const router = useRouter()
  const fileId = router.query.fileId as string
  const fileUseCase = useFile()
  const user = useAuth()

  const { data: file } = useRequest(
    () => fileUseCase.fetchFileDetail(fileId),
    null,
    () => router.push("/404"),
    fileId != null,
  )
  const { width } = useWindowSize()
  const [sizeRate, setSizeRate] = useState(6)
  const [stamps, setStamps] = useState<StampModel[]>(file?.stamps ?? [])

  useEffect(() => {
    setStamps(file?.stamps ?? [])
  }, [file])

  const handleAddStamp = (page: number, x: number, y: number) => {
    if (user == null) {
      return
    }
    setStamps((prev) => [
      ...prev.filter((stamp) => !stamp.id.startsWith("temporary_")),
      {
        id: "temporary_" + new Date().getTime(),
        author: {
          id: user.uid,
          iconUrl: user.photoURL ?? "",
          name: user.displayName ?? "",
        },
        comments: [],
        position: {
          page,
          x,
          y,
        },
      },
    ])
  }

  const handleSendComment = async (
    stampId: string,
    comment:
      | { dataType: "audio"; content: File; title: string }
      | { dataType: "text"; content: string },
  ) => {
    if (comment.dataType === "audio") {
      // await fileUseCase.postComment({
      //   dataType: comment.dataType,
      //   content: comment.content,
      //   title: comment.title as string,
      // }, fileId, stampId)
      // TODO: 音声ファイル送信
      console.log("send audio file")
    } else {
      await fileUseCase.postComment(
        {
          dataType: comment.dataType,
          content: comment.content,
        },
        fileId,
        stampId,
      )
    }
  }

  const handleSendCommentAndStamp = async (
    stamp: StampModel,
    comment:
      | { dataType: "audio"; content: File; title: string }
      | { dataType: "text"; content: string },
  ) => {
    if (comment.dataType === "audio") {
      // TODO: 音声ファイル送信
      const res = await fileUseCase.postStamp(
        {
          dataType: "audio",
          content: comment.content,
          title: comment.title,
          page: `${stamp.position.page}`,
          x: `${stamp.position.x}`,
          y: `${stamp.position.y}`,
        },
        fileId,
      )
      setStamps((prev) => [...prev, res])
    } else {
      const res = await fileUseCase.postStamp(
        {
          dataType: "text",
          content: comment.content,
          page: `${stamp.position.page}`,
          x: `${stamp.position.x}`,
          y: `${stamp.position.y}`,
        },
        fileId,
      )
      setStamps((prev) => [...prev, res])
    }
  }

  // NOTE: Popoverを開いたときに他のスタンプに邪魔されないように、y座標が大きいスタンプから順にレンダリングする
  const sortedStamps = stamps.sort((a, b) =>
    a.position.y < b.position.y ? 1 : a.position.y === b.position.y ? 0 : -1,
  )

  const handleDeleteTemporary = (stamp: StampModel) => {
    setStamps((prev) => prev.filter(({ id }) => id !== stamp.id))
  }

  return (
    <div className="flex flex-col items-center w-full px-[10vw] py-8 bg-bgBlack relative">
      <PDFViewer
        src="/sample2.pdf"
        stamps={sortedStamps}
        onStampAdd={handleAddStamp}
        width={width * (sizeRate / 10.0)}
        stampRender={(stamp) => {
          const isTemporary = stamp.id.startsWith("temporary_")
          return (
            <div className="relative" key={stamp.id}>
              <Stamp
                stamp={stamp}
                onAddComment={(comment) => {
                  if (isTemporary) {
                    handleSendCommentAndStamp(stamp, comment)
                  } else {
                    handleSendComment(stamp.id, comment)
                  }
                }}
                isTemporary={isTemporary}
                onClose={() => {
                  if (isTemporary) {
                    handleDeleteTemporary(stamp)
                  }
                }}
              />
              <div className="absolute z-10 w-40 text-sm bg-white border border-gray-400 rounded shadow-md opacity-100 left-full top-full hover:opacity-30">
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
          )
        }}
      />
      {/* サイドバー */}
      <div className="fixed top-0 right-0 p-4 m-4 space-y-8 rounded bg-bgBlack/60">
        <ShareButton onClick={() => console.log("share")} />
        <SizeRateButton sizeRate={sizeRate} setSizeRate={setSizeRate} />
      </div>
      {/* 戻るボタン */}
      <div className="fixed top-0 left-0 m-4 space-y-8 rounded">
        <BackButton />
      </div>
    </div>
  )
}

export default FileDetail

const ShareButton: React.VFC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="flex items-center justify-center transition bg-white rounded-full w-14 h-14 shadow-paper hover:bg-gray-100"
    title="シェア"
    aria-label="シェア"
    onClick={onClick}
  >
    <Share />
  </button>
)

const SizeRateButton: React.VFC<{
  sizeRate: number
  setSizeRate: React.Dispatch<React.SetStateAction<number>>
}> = ({ sizeRate, setSizeRate }) => (
  <div className="flex flex-col items-center space-y-2 bg-white rounded-full shadow-paper">
    <button
      className="flex items-center justify-center transition bg-white rounded-full w-14 h-14 hover:bg-gray-100"
      onClick={() => setSizeRate((prev) => prev + 1)}
      disabled={12 <= sizeRate}
      title="拡大"
      aria-label="拡大"
    >
      <Plus />
    </button>
    <button
      className="flex items-center justify-center transition bg-white rounded-full w-14 h-14 hover:bg-gray-100"
      onClick={() => setSizeRate((prev) => prev - 1)}
      disabled={sizeRate <= 1}
      title="縮小"
      aria-label="縮小"
    >
      <Minus />
    </button>
  </div>
)

const BackButton: React.VFC = () => (
  <Link href="/dashboard">
    <a
      className="flex items-center justify-center px-4 py-2 text-white transition rounded-full hover:bg-gray-100 hover:text-black group"
      aria-label="ダッシュボードへ戻る"
    >
      <ArrowLeft className="mr-2" />
      <span className="opacity-0 pointer-events-none group-hover:opacity-100">
        ダッシュボード
      </span>
    </a>
  </Link>
)