import React, { useEffect, useState } from "react"
import Image from "next/image"
import { File } from "react-feather"
import { FileData } from "@domain/fileData"

export type ThumbnailProps = {
  file: FileData
  className?: string
}

export const Thumbnail: React.VFC<ThumbnailProps> = ({ file, className }) => {
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [file])

  return (
    <div
      className={
        "flex items-center justify-center w-full h-full bg-gray-50 " +
        (className ?? "")
      }
    >
      {!error ? (
        <Image
          src={file.thumbnail}
          alt=""
          layout="fill"
          className="object-cover pointer-events-none"
          onError={() => setError(true)}
        />
      ) : (
        <File size={48} />
      )}
    </div>
  )
}
