import React from "react"
import { NextPage } from "next"
import { Icon } from "@components/atoms/Icon"
import Thread from "@components/components/Thread"

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
      <div className="flex flex-col items-start">
        <Thread
          comments={[
            {
              id: "1",
              dataType: "audio",
              title: "犬の鳴き声",
              content: "/dog.wav",
              author: {
                id: "1",
                name: "John Doe",
                iconUrl: "/icons/icon03.png",
              },
              postedAt: new Date().toISOString(),
            },
            {
              id: "2",
              dataType: "text",
              content: "了解。他に何か説明足す？",
              author: {
                id: "1",
                name: "John Doe",
                iconUrl: "/icons/icon03.png",
              },
              postedAt: new Date().toISOString(),
            },
            {
              id: "3",
              dataType: "text",
              content: "了解。他に何か説明足す？",
              author: {
                id: "1",
                name: "John Doe",
                iconUrl: "/icons/icon03.png",
              },
              postedAt: new Date().toISOString(),
            },
            {
              id: "4",
              dataType: "audio",
              title: "犬の鳴き声",
              content: "/dog.wav",
              author: {
                id: "1",
                name: "John Doe",
                iconUrl: "/icons/icon03.png",
              },
              postedAt: new Date().toISOString(),
            },
            {
              id: "5",
              dataType: "audio",
              title: "犬の鳴き声",
              content: "/dog.wav",
              author: {
                id: "1",
                name: "John Doe",
                iconUrl: "/icons/icon03.png",
              },
              postedAt: new Date().toISOString(),
            },
            {
              id: "6",
              dataType: "text",
              content:
                "00:46 ここの説明はいらないと思う！00:46 ここの説明はいらないと思う！00:46 ここの説明はいらないと思う！00:46 ここの説明はいらないと思う！",
              author: {
                id: "1",
                name: "John Doe",
                iconUrl: "/icons/icon03.png",
              },
              postedAt: new Date().toISOString(),
            },
            {
              id: "7",
              dataType: "text",
              content: "00:46 ここの説明はいらないと思う！",
              author: {
                id: "1",
                name: "John Doe",
                iconUrl: "/icons/icon03.png",
              },
              postedAt: new Date().toISOString(),
            },
          ]}
        />
      </div>
    </div>
  )
}

export default ComponentCheck
