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
import { useAuthUser } from "@hooks/useAuth"
import { UrlShareModal } from "@components/organisms/urlShareModal"

const PDFViewer: React.ComponentType<PDFViewerProps> = dynamic(
  () =>
    import("../components/components/PdfViewer").then(
      (module) => module.PDFViewer,
    ),
  {
    ssr: false,
  },
)

type FileDetailQuery = {
  fileId: string
}

const FileDetail: NextPage<Record<string, never>, FileDetailQuery> = () => {
  const router = useRouter()
  const fileId = router.query.fileId as string
  const fileUseCase = useFile()
  const user = useAuthUser()
  const [openShareModal, setOpenShareModal] = useState(false)

  const { data: file } = useRequest(
    () => fileUseCase.fetchFileDetail(fileId),
    null,
    () => router.push("/404"),
    fileId != null && user != null,
    false,
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
      | { dataType: "audio"; content: Blob; title: string }
      | { dataType: "text"; content: string },
  ) => {
    const body =
      comment.dataType === "audio"
        ? {
            dataType: comment.dataType,
            content: comment.content,
            title: comment.title as string,
          }
        : {
            dataType: comment.dataType,
            content: comment.content,
          }
    const res = await fileUseCase.postComment(body, fileId, stampId)
    setStamps((prev) =>
      prev.map((stamp) => {
        if (stamp.id === stampId) {
          return {
            ...stamp,
            comments: [...stamp.comments, res],
          }
        } else {
          return stamp
        }
      }),
    )
  }

  const handleSendCommentAndStamp = async (
    stamp: StampModel,
    comment:
      | { dataType: "audio"; content: Blob; title: string }
      | { dataType: "text"; content: string },
  ) => {
    if (comment.dataType === "audio") {
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
      setStamps((prev) => [
        ...prev,
        {
          ...res,
          position: {
            page:
              typeof res.position.page === "string"
                ? parseInt(res.position.page)
                : res.position.page,
            x:
              typeof res.position.x === "string"
                ? parseFloat(res.position.x)
                : res.position.x,
            y:
              typeof res.position.y === "string"
                ? parseFloat(res.position.y)
                : res.position.y,
          },
        },
      ])
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

  console.log(stamps)

  const handleDeleteTemporary = (stamp: StampModel) => {
    setStamps((prev) => prev.filter(({ id }) => id !== stamp.id))
  }

  return (
    <>
      <div className="flex flex-col items-center w-full px-[10vw] py-8 bg-bgBlack relative min-h-screen">
        <PDFViewer
          src={file?.fileSnapshot.file.url ?? ""}
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
                {/* デバッグ（座標確認用） */}
                {/* <div className="absolute z-10 w-40 text-sm bg-white border border-gray-400 rounded shadow-md opacity-100 left-full top-full hover:opacity-30">
                <div className="text-center">
                  <span className="inline-block pointer-events-none">
                    (x, y) = ({stamp.position.x}, {stamp.position.y})
                  </span>
                  <br />
                  <span className="inline-block pointer-events-none">
                    page = {stamp.position.page}
                  </span>
                </div>
              </div> */}
              </div>
            )
          }}
        />
        {/* サイドバー */}
        <div className="fixed top-0 right-0 p-4 m-4 space-y-8 rounded bg-bgBlack/60">
          <ShareButton onClick={() => setOpenShareModal(true)} />
          <SizeRateButton sizeRate={sizeRate} setSizeRate={setSizeRate} />
        </div>
        {/* 戻るボタン */}
        <div className="fixed top-0 left-0 m-4 space-y-8 rounded">
          <BackButton />
        </div>
        {user === null && (
          <div className="fixed left-0 m-4 space-y-8 rounded top-20">
            <LoginButton />
          </div>
        )}
      </div>
      {file != null && (
        <UrlShareModal
          open={openShareModal}
          onClose={() => setOpenShareModal(false)}
          file={file?.fileSnapshot.file}
        />
      )}
    </>
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

const LoginButton: React.VFC = () => (
  <Link href="/">
    <a
      className="flex items-center justify-center px-4 py-2 text-black text-white transition bg-gray-100 rounded-full group"
      aria-label="ログインする"
    >
      <ArrowLeft className="mr-2" />
      <span className="opacity-100 pointer-events-none">ログインする</span>
    </a>
  </Link>
)
