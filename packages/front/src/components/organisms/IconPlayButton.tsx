import { Icon } from "@components/atoms/Icon"
import { User } from "@domain/user"
import React from "react"

export type IconPlayButtonProps = {
  user: User
  size: number
  state: "playing" | "default"
  alwaysShowIcon: boolean
  onClick?: () => void
}

const IconPlayButton: React.VFC<IconPlayButtonProps> = ({
  user,
  size,
  state,
  alwaysShowIcon,
  onClick,
}) => {
  return (
    <button className="relative group" onClick={onClick}>
      <Icon user={user} size={size} />
      <div
        aria-label={state === "playing" ? "一時停止" : "再生"}
        className={
          "absolute inset-0 flex items-center justify-center text-xl font-bold rounded-full bg-black/30 transition " +
          (alwaysShowIcon ? "" : "group-hover:opacity-100 opacity-0")
        }
      >
        {state === "playing" ? "| |" : "▶︎"}
      </div>
    </button>
  )
}

export default IconPlayButton
