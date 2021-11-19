import React, { useEffect, useReducer, useState } from "react"
import { NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
import Head from "next/head"
import dynamic from "next/dynamic"
import type { PDFViewerProps } from "@components/components/PdfViewer"
import Stamp from "@components/atoms/Stamp"
import { Stamp as StampModel } from "@domain/stamp"
import { useWindowSize, useWindowWidthGreaterThan } from "@hooks/useWindowSize"
import { Share, Plus, Minus, ArrowLeft, Search } from "react-feather"
import { useRequest } from "@hooks/useRequest"
import { useFile } from "@hooks/useFile"
import { useRouter } from "next/router"
import { useAuthUser } from "@hooks/useAuth"
import { UrlShareModal } from "@components/organisms/urlShareModal"
import { auth, googleProvider } from "@lib/firebase"
import { signInAnonymously, linkWithPopup } from "firebase/auth"
import { authUseCase } from "useCase"
import authReducer from "@reducers/authReducer"
import PermissionModal from "@components/organisms/PermissionModal"
import {
  SearchDawerColumn,
  SearchDrawerOverlay,
} from "@components/components/SearchModal"
import useHash from "@hooks/useHash"

const TEMPORARY_STAMP_PREFIX = "temporary_"

const PDFViewer: React.ComponentType<PDFViewerProps> = dynamic(
  () =>
    import("../components/components/PdfViewer").then(
      (module) => module.PDFViewer,
    ),
  {
    ssr: false,
  },
)

/** 検索モーダルのレスポンシブ対応の閾値 */
const SEARCH_MODAL_RESPONSIVE_BORDER = 1300

type FileDetailQuery = {
  fileId: string
}

const FileDetail: NextPage<Record<string, never>, FileDetailQuery> = () => {
  const router = useRouter()
  const fileId = router.query.fileId as string
  const [hash, setHash] = useHash()
  const fileUseCase = useFile()
  const user = useAuthUser()
  const [openShareModal, setOpenShareModal] = useState(false)
  const [openPermissionModal, setOpenPermissionModal] = useState(false)
  const [openSearchDrawer, setOpenSearchDrawer] = useState(false)

  const { data: file } = useRequest(
    () => fileUseCase.fetchFileDetail(fileId),
    null,
    () => router.push("/404"),
    fileId != null && user != null,
    false,
  )
  const { width: windowWidth } = useWindowSize()
  const isWideWidth = useWindowWidthGreaterThan(SEARCH_MODAL_RESPONSIVE_BORDER)
  const [sizeRate, setSizeRate] = useState(6)
  const [stamps, setStamps] = useState<StampModel[]>(file?.stamps ?? [])

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        signInAnonymously(auth)
          .then((u) => {
            console.log(u.user.getIdToken())
          })
          .catch((e) => {
            throw e.message
          })
      }
    })
  }, [])

  useEffect(() => {
    setStamps(file?.stamps ?? [])
  }, [file])

  // temporaryスタンプを追加する
  const handleAddStamp = (page: number, x: number, y: number) => {
    if (user == null || user.isAnonymous) {
      setOpenPermissionModal(true)
      return
    }
    // 既に存在しているtemporaryスタンプを消去し、新しくtemporaryスタンプを追加する
    setStamps((prev) => [
      ...prev.filter((stamp) => !stamp.id.startsWith(TEMPORARY_STAMP_PREFIX)),
      {
        id: TEMPORARY_STAMP_PREFIX + new Date().getTime(),
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

  /** スタンプと最初のコメントを投稿する */
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

  /** 既にあるスタンプにコメントを投稿する */
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

  // NOTE: Popoverを開いたときに他のスタンプに邪魔されないように、y座標が大きいスタンプから順にレンダリングする
  const sortedStamps = stamps.sort((a, b) =>
    a.position.y < b.position.y ? 1 : a.position.y === b.position.y ? 0 : -1,
  )

  // temporaryスタンプを消去する
  const handleDeleteTemporary = (stamp: StampModel) => {
    setStamps((prev) => prev.filter(({ id }) => id !== stamp.id))
  }

  // SearchModalを閉じたときにhashをクリアする（見栄えが良いので）
  useEffect(() => {
    if (isWideWidth && !openSearchDrawer) {
      setHash(null)
    }
  }, [openSearchDrawer, isWideWidth])

  return (
    <>
      <div className="px-[10vw] py-8 bg-bgBlack relative min-h-screen">
        {/* TODO: 閾値を変数化する */}
        <div
          className={`flex flex-col items-center transition-all ${
            isWideWidth && openSearchDrawer
              ? "w-[calc(100%-var(--searchmodal-width))]"
              : "w-full"
          }`}
        >
          <PDFViewer
            src={file?.fileSnapshot.file.url ?? ""}
            stamps={sortedStamps}
            onStampAdd={handleAddStamp}
            width={windowWidth * (sizeRate / 10.0)}
            stampRender={(stamp) => {
              const isTemporary = stamp.id.startsWith(TEMPORARY_STAMP_PREFIX)
              return (
                <div
                  key={stamp.id}
                  id={stamp.id}
                  className={`relative p-3 border-dashed border-2 transition rounded ${
                    hash == stamp.id
                      ? "border-yellow-600"
                      : "border-transparent"
                  }`}
                >
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
                      setHash(null)
                      if (isTemporary) {
                        handleDeleteTemporary(stamp)
                      }
                    }}
                  />
                </div>
              )
            }}
          />
          {isWideWidth && (
            <SearchDawerColumn
              stamps={stamps}
              open={openSearchDrawer}
              onClose={() => setOpenSearchDrawer(false)}
            />
          )}
        </div>
        {/* サイドバー */}
        <div className="fixed top-0 right-0 p-4 m-4 space-y-8 rounded bg-bgBlack/60">
          <IconButton title="シェア" onClick={() => setOpenShareModal(true)}>
            <Share />
          </IconButton>
          <IconButton title="検索" onClick={() => setOpenSearchDrawer(true)}>
            <Search />
          </IconButton>
          <SizeRateButton sizeRate={sizeRate} setSizeRate={setSizeRate} />
        </div>
        {user == null || user?.isAnonymous ? (
          // ログインボタン
          <div className="fixed left-0 m-4 space-y-8 rounded">
            <LoginButton />
          </div>
        ) : (
          // 戻るボタン
          <div className="fixed top-0 left-0 m-4 space-y-8 rounded">
            <BackButton />
          </div>
        )}
      </div>
      {/* 共有ポップアップ */}
      {file != null && (
        <UrlShareModal
          open={openShareModal}
          onClose={() => setOpenShareModal(false)}
          file={file?.fileSnapshot.file}
        />
      )}
      {/* 検索モーダル */}
      {!isWideWidth && (
        <SearchDrawerOverlay
          stamps={stamps}
          open={openSearchDrawer}
          onClose={() => setOpenSearchDrawer(false)}
          autoCloseWhenClickShow
        />
      )}
      <PermissionModal
        open={openPermissionModal}
        onClose={() => setOpenPermissionModal(false)}
      />
    </>
  )
}

export default FileDetail

const IconButton: React.VFC<{
  onClick: () => void
  children: React.ReactNode
  title: string
}> = ({ onClick, children, title }) => (
  <button
    className="flex items-center justify-center transition bg-white rounded-full w-14 h-14 shadow-paper hover:bg-gray-100"
    title={title}
    aria-label={title}
    onClick={onClick}
  >
    {children}
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

const LoginButton: React.VFC = () => {
  const [isError, setIsError] = useState<boolean>(false)
  const router = useRouter()
  const [, dispatch] = useReducer(authReducer.reducer, authReducer.initialState)

  const reLogIn = async () => {
    try {
      await authUseCase.signIn(dispatch)
    } catch (err) {
      console.log(err)
    }
  }

  const loginWithGoogle = () => {
    if (auth.currentUser) {
      linkWithPopup(auth.currentUser, googleProvider)
        .then((result) => {
          const user = result.user
          console.log(user)
          setIsError(false)
          router.push("/dashboard")
        })
        .catch(() => {
          setIsError(true)
        })
    }
  }

  useEffect(() => {
    isError && reLogIn()
  }, [isError])

  return (
    <button
      className="flex items-center justify-center px-4 py-2 space-x-2 text-black transition bg-gray-100 rounded-full hover:bg-gray-200"
      aria-label="ログインする"
      onClick={loginWithGoogle}
    >
      <Image
        src="/icons/g-logo.png"
        width={24}
        height={24}
        className="object-fit"
      />
      <span>ログインする</span>
    </button>
  )
}
