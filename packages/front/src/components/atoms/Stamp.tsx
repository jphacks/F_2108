import type { Stamp as StampModel } from "@domain/stamp"
import React from "react"
import { Icon } from "./Icon"

export type StampProps = {
  stamp: StampModel
}

const Stamp: React.VFC<StampProps> = ({ stamp }) => {
  return (
    <div>
      <div className="relative border-[3px] border-solid rounded-full shadow-stamp border-primary">
        <Icon user={stamp.author} size={48} />
        <div className="absolute inset-0 rounded-full bg-black/30" />
        <span className="absolute flex items-center justify-center w-5 h-5 text-[9px] tracking-tighter font-bold leading-none text-black rounded-full tabular-nums bg-primary top-[-10%] right-[-10%]">
          +5
        </span>
        <div
          className="absolute inset-0 flex items-center justify-center text-3xl select-none text-white/90"
          aria-label="投稿を見る"
        >
          ▶︎
        </div>
      </div>
    </div>
  )
}

export default Stamp
