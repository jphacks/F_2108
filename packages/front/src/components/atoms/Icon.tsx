import React, { useEffect, useState } from "react"
import Image from "next/image"
import { User } from "@domain/user"

export type IconProps = {
  user: User
  size: number
}

export const Icon: React.VFC<IconProps> = ({ user, size }) => {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [user])

  return (
    <div
      className="overflow-hidden bg-gray-200 rounded-full"
      style={{ width: size, height: size }}
    >
      {hasError ? (
        <div
          className="flex items-center justify-center w-full h-full font-bold leading-none select-none bg-primary"
          aria-label={user.name}
          style={{ fontSize: size * 0.5 }}
        >
          <span aria-hidden>{user.name.split("")[0]}</span>
        </div>
      ) : (
        <Image
          src={user.iconUrl}
          alt={user.name}
          width={size}
          height={size}
          className="object-cover pointer-events-none"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  )
}
