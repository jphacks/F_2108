import type { Stamp as StampModel } from "@domain/stamp"
import React, { Fragment, useCallback, useEffect, useState } from "react"
import { Icon } from "./Icon"
import { Popover, Transition } from "@headlessui/react"
import { Play } from "react-feather"
import Thread from "@components/components/Thread"

export type StampProps = {
  stamp: StampModel
  onAddComment: (
    comment:
      | { dataType: "audio"; content: Blob; title: string }
      | { dataType: "text"; content: string },
  ) => void
  isTemporary?: boolean
  onClose?: () => void
}

const Stamp: React.VFC<StampProps> = ({
  stamp,
  onAddComment,
  isTemporary,
  onClose,
}) => {
  // const [popOverDirection, setPopOverDirection] = useState<
  //   "left" | "bottom" | "right"
  // >("bottom")

  // const handleIconRef = useCallback((node: HTMLDivElement) => {
  //   if (node == null) {
  //     return
  //   }
  //   const rect = node.getBoundingClientRect()
  //   if (rect.left < rect.right) {
  //     if (540 * 1.1 < rect.left) {
  //       setPopOverDirection("left")
  //     } else {
  //       setPopOverDirection("bottom")
  //     }
  //   } else {
  //     if (540 * 1.1 < rect.right) {
  //       setPopOverDirection("right")
  //     } else {
  //       setPopOverDirection("bottom")
  //     }
  //   }
  // }, [])

  const buttonRef = useCallback((node: HTMLButtonElement) => {
    if (isTemporary) {
      node?.click()
    }
  }, [])

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button ref={buttonRef}>
            <div
              className="relative"
              // ref={handleIconRef}
            >
              <StampIcon stamp={stamp} open={open} />
            </div>
          </Popover.Button>
          {onClose != null && <OpenCheck open={open} onClose={onClose} />}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 max-w-sm px-4 transform sm:px-0 lg:max-w-3xl max-h-[540px] -translate-x-1/2 left-1/2 mt-4">
              <Thread
                isOpened={open}
                comments={stamp.comments}
                onAddComment={onAddComment}
              />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

export default Stamp

const StampIcon: React.VFC<{ stamp: StampModel; open: boolean }> = ({
  stamp,
  open,
}) => (
  <div className="relative border-[3px] border-solid rounded-full shadow-stamp focus:shadow-none active:shadow-none border-primary transition">
    {open && (
      <div className="absolute inset-0 rounded-full bg-primary animate-ping-slow" />
    )}
    <Icon user={stamp.author} size={48} />
    <div
      className={
        "absolute inset-0 rounded-full bg-black/30 transition " +
        (open ? "opacity-0" : "")
      }
    />
    {2 <= stamp.comments.length && (
      <span className="absolute flex items-center justify-center w-5 h-5 text-[9px] tracking-tighter font-bold leading-none text-black rounded-full tabular-nums bg-primary top-[-10%] right-[-10%]">
        +{stamp.comments.length}
      </span>
    )}
    <div
      className={
        "absolute inset-0 flex items-center justify-center text-3xl transition " +
        (open ? "opacity-0" : "")
      }
      aria-label="投稿を見る"
    >
      <Play fill="rgba(255,255,255,90)" size={28} strokeWidth={0} />
    </div>
  </div>
)

/**
 * PopoverのonCloseイベントを取得するためのコンポーネント（ハック的なことをしている）
 */
const OpenCheck: React.VFC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [onceOpen, setOnceOpen] = useState(false)
  useEffect(() => {
    if (open) {
      setOnceOpen(true)
    } else if (onceOpen && !open) {
      onClose()
    }
  }, [open])
  return null
}
