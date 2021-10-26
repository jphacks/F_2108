import React from "react"
import { NextPage } from "next"
import { Icon } from "@components/atoms/Icon"
import dynamic from "next/dynamic"
const AudioWave = dynamic(() => import("@components/components/AudioComment"), {
  ssr: false,
})

const ComponentCheck: NextPage = () => {
  return (
    <div className="p-8">
      <h1>コンポーネントのUI確認用ページです</h1>
      <Icon
        user={{
          id: "1",
          name: "John Doe",
          iconUrl: "/icons/icon03.png",
        }}
        size={64}
      />
      <div className="flex flex-col items-start my-4 space-y-4">
        <AudioWave
          comment={{
            id: 1,
            dataType: "audio",
            title: "犬の鳴き声",
            content: "/dog.wav",
            author: {
              id: "1",
              name: "John Doe",
              iconUrl: "/icons/icon03.png",
            },
            postedAt: new Date().toISOString(),
          }}
        />
      </div>
    </div>
  )
}

export default ComponentCheck
