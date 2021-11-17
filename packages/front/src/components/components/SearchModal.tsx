import HighlightText from "@components/atoms/HighlightText"
import { SearchInput } from "@components/organisms/searchInput"
import { Stamp } from "@domain/stamp"
import { Dialog, Transition } from "@headlessui/react"
import { stampCompareFunc, stampIsMatched } from "@lib/stampSearch"
import Link from "next/link"
import React, { Fragment, useEffect, useMemo, useState } from "react"
import { X as Cross, ArrowUpLeft } from "react-feather"
import AudioComment from "./AudioComment"
import { TextComment } from "./TextComment"

/**
 * 検索ドロワー
 * @param props
 * @returns
 */
export const SearchDrawerOverlay: React.VFC<SearchScreenProps> = (props) => {
  return (
    <Transition appear show={props.open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={props.onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300 transform"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in duration-200 transform"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="fixed inset-y-0 right-0">
            <SearchScreen {...props} />
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

/**
 * 検索欄（ドロワーではないため、表示中でも他の部分を操作できる）
 * @param props
 * @returns
 */
export const SearchDawerColumn: React.VFC<SearchScreenProps> = (props) => {
  // CSSアニメーション発火用のプロパティ（props.openと1サイクル遅れて更新される）
  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShow(props.open)
    }, 0)
  }, [props.open])

  return (
    <div
      className={`fixed inset-y-0 right-0 w-[var(--searchmodal-width)] z-20 transform transition-all ${
        show && props.open ? "translate-x-0" : "translate-x-full"
      } ${!props.open ? "pointer-events-none" : ""}`}
    >
      {(props.open || show) && <SearchScreen {...props} />}
    </div>
  )
}

export type SearchScreenProps = {
  stamps: Stamp[]
  open: boolean
  onClose: () => void
  autoCloseWhenClickShow?: boolean
}

const SearchScreen: React.VFC<SearchScreenProps> = ({
  stamps,
  onClose,
  autoCloseWhenClickShow,
}) => {
  const [searchInput, setSearchInput] = useState("")

  const sortedStamps = useMemo(() => {
    const sortedStamps = [...stamps]
    sortedStamps.sort((a, b) => stampCompareFunc(searchInput, a, b))
    return sortedStamps
  }, [stamps, searchInput])

  return (
    <div className="w-[var(--searchmodal-width)] h-full max-w-full z-40 shadow-paper-inverse bg-white/80 flex flex-col">
      <div className="flex items-center justify-center flex-shrink-0 w-full h-16 px-4 py-3 bg-black shadow-paper">
        <SearchInput setter={setSearchInput} value={searchInput} />
        <button
          onClick={onClose}
          className="flex items-start justify-center p-4"
        >
          <Cross stroke="rgba(255, 255, 255, 0.8)" />
        </button>
      </div>
      <div className="flex flex-col h-full p-4 space-y-8 overflow-y-scroll overscroll-y-none">
        {sortedStamps.map((stamp) => {
          return (
            <StampItem
              key={stamp.id}
              stamp={stamp}
              matchedStr={
                stampIsMatched(stamp, searchInput) ? searchInput : undefined
              }
              onClickShowOnPdf={
                autoCloseWhenClickShow ? () => onClose() : undefined
              }
            />
          )
        })}
      </div>
    </div>
  )
}

type StampItemProps = {
  stamp: Stamp
  matchedStr?: string
  onClickShowOnPdf?: () => void
}

const StampItem = React.memo<StampItemProps>(
  ({ stamp, matchedStr, onClickShowOnPdf }) => {
    return (
      <div>
        <Link href={`#${stamp.id}`}>
          <a
            className="flex items-center mb-0.5 space-x-1 text-sm text-gray-500"
            onClick={onClickShowOnPdf}
          >
            <ArrowUpLeft />
            PDF上で見る
          </a>
        </Link>
        <div className="flex flex-col items-start px-6 py-6 space-y-4 bg-black rounded-lg">
          {stamp.comments.map((comment) =>
            comment.dataType === "audio" ? (
              <div key={comment.id}>
                <AudioComment
                  comment={comment}
                  titleRender={
                    matchedStr == null
                      ? undefined
                      : (content: string) => (
                          <HighlightText highlightText={matchedStr}>
                            {content}
                          </HighlightText>
                        )
                  }
                />
              </div>
            ) : (
              <div key={comment.id} className="ml-14">
                <TextComment
                  comment={comment}
                  contentRender={
                    matchedStr == null
                      ? undefined
                      : (content: string) => (
                          <HighlightText highlightText={matchedStr}>
                            {content}
                          </HighlightText>
                        )
                  }
                />
              </div>
            ),
          )}
        </div>
      </div>
    )
  },
)
