import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import { analyzeAudioWave } from "@lib/audio/analyzeAudioWave"
import { formatSec } from "@lib/formatTime"
import IconPlayButton from "@components/organisms/IconPlayButton"
import { AudioComment } from "@domain/comment"
import dynamic from "next/dynamic"
const AudioGraph = dynamic(() => import("@components/atoms/AudioGraph"), {
  ssr: false,
})

/** サンプリング数 */
const SAMPLING_COUNT = 60
/** キャンバス幅 */
const CANVAS_WIDTH = 300.0
/** キャンバス高さ */
const CANVAS_HEIGHT = 60.0

export type AudioWaveProps = {
  comment: AudioComment
  onPlayEnd?: () => void
}

const AudioIndicator: React.VFC<AudioWaveProps> = ({ comment, onPlayEnd }) => {
  // グラフで表示する波形データ
  const [data, setData] = useState<number[]>([])
  // Audioデータ
  const audio = useRef<HTMLAudioElement | null>(null)
  // 再生中か
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  // 既に再生済みでないか
  const [notPlayedYet, setNotPlayedYet] = useState(true)
  // 現在再生中のミリ秒（リレンダリングのために利用）
  const [_, setProgressMs] = useState<number>(0)
  const timer = useRef<NodeJS.Timer | null>(null)

  // オーディオファイルの解析
  useEffect(() => {
    ;(async () => {
      const res = await axios.get(comment.content, {
        responseType: "arraybuffer",
      })
      const waveData = await analyzeAudioWave(
        res.data as ArrayBuffer,
        SAMPLING_COUNT,
      )
      setData(waveData)
    })()
  }, [])

  // オーディオファイルの読み込み
  useEffect(() => {
    audio.current = new Audio(comment.content)
    // 再生終了時のイベント
    audio.current.addEventListener("ended", () => {
      if (timer.current != null) {
        clearInterval(timer.current)
      }
      setIsPlaying(false)
      setNotPlayedYet(true)
      if (audio.current != null) {
        audio.current.currentTime = 0.0
        setProgressMs(0)
        onPlayEnd?.()
      }
    })
  }, [])

  // 再生・一時停止ボタン
  const playOrPause = () => {
    if (audio.current == null) {
      return
    }
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  // 再生する
  const play = () => {
    if (audio.current == null) {
      return
    }
    setNotPlayedYet(false)
    setIsPlaying(true)
    audio.current.play()
    timer.current = setInterval(() => {
      // to rerender
      setProgressMs((prev) => prev + 100)
    }, 100)
  }

  // 一時停止する
  const pause = () => {
    if (audio.current == null) {
      return
    }
    setIsPlaying(false)
    audio.current.pause()
    if (timer.current != null) {
      clearInterval(timer.current)
    }
  }

  // クリックした場所までスキップする
  const handleSetProgress = (selectedIndex: number) => {
    if (audio.current == null) {
      return
    }
    audio.current.currentTime =
      audio.current.duration * (selectedIndex / SAMPLING_COUNT)
    setProgressMs(audio.current.currentTime * 1000)
    if (notPlayedYet) {
      play()
    }
  }

  // 現在の再生位置（0~1で正規化）
  const progress =
    audio.current == null
      ? 0
      : audio.current.currentTime / audio.current.duration

  return (
    <section className="text-white rounded-2xl">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <IconPlayButton
            user={comment.author}
            size={54}
            state={isPlaying ? "playing" : "default"}
            alwaysShowIcon={isPlaying || !notPlayedYet}
            onClick={() => playOrPause()}
          />
        </div>
        <div>
          <h1 className="text-xs font-bold">
            {isPlaying && (
              <span
                aria-hidden
                className="inline-flex items-center justify-center w-2.5 h-2.5 mr-1.5 rounded-full bg-primary"
              >
                <span className="w-3 h-3 rounded-full bg-primary/75 animate-ping" />
              </span>
            )}
            {comment.title}
          </h1>
          <div style={{ minHeight: CANVAS_HEIGHT }}>
            <AudioGraph
              data={data}
              progress={progress}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onClickUnit={handleSetProgress}
            />
          </div>
        </div>
      </div>
      <div className="text-xs text-right tabular-nums">
        {audio.current != null &&
          Number.isInteger(audio.current.duration) &&
          formatSec(audio.current.duration)}
      </div>
    </section>
  )
}

export default AudioIndicator
