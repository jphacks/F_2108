import React from "react"
import Image from "next/image"
import { useAuthInitialized } from "@hooks/useAuth"
import { Loader } from "react-feather"

export type PageProps = {
  children: React.ReactNode
}

export const Page: React.VFC<PageProps> = ({ children }) => {
  const authInitialized = useAuthInitialized()
  if (!authInitialized) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center mb-16"
        aria-label="ローディング中"
      >
        <div className="w-[200px] h-[100px] relative mb-2">
          <Image
            src="/logo_black.png"
            objectFit="contain"
            className="drag-none object-fit"
            layout="fill"
          />
        </div>
        <div className="flex items-center justify-center">
          <Loader className="mr-3 animate-spin-slow" />
          <p className="font-bold tracking-widest">loading...</p>
        </div>
      </div>
    )
  }
  return <>{children}</>
}
