import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Comment } from "@domain/comment"
import { TextComment } from "./TextComment"
import AudioComment from "./AudioComment"
import RecorderService from "@lib/js/RecordService"
import dynamic from "next/dynamic"
const AudioGraph = dynamic(() => import("@components/atoms/AudioGraph"), {
  ssr: false,
})

type Thread = {
  comments: Comment[]
  className?: string
}

type Recording = {
  ts: number
  blobUrl: string
  mimeType: string
  size: number
}

const Thread: React.VFC<Thread> = ({ comments, className }) => {
  const [inputMode, setInputMode] = useState<
    "audio" | "text" | "audio-title" | null
  >(null)

  const [recorderService, setRecorderService] =
    useState<RecorderService | null>(null)
  const [recordingInProgress, setRecordingInProgress] = useState(false)
  const [volumes, setVolumes] = useState<number[]>([])
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const audioTitleRef = useRef<HTMLInputElement | null>(null)
  const [text, setText] = useState("")
  const [audioTitle, setAudioTitle] = useState("")

  useEffect(() => {
    const _recorderService = new RecorderService((volume: number) => {
      setVolumes((prev) => [...prev, volume])
    })
    setRecorderService(_recorderService)
  }, [])

  const handleRecording = useCallback(
    async (evt: { detail: { recording: Recording } }) => {
      console.log("evt", evt)
      // submit
      console.log(evt.detail.recording.blobUrl)
      if (recorderService != null) {
        recorderService.em.removeEventListener(
          "recording",
          handleRecording as any,
        )
      }
    },
    [],
  )

  const handleClickBtnRecording = () => {
    if (recorderService == null) {
      return
    }
    console.log("recordingInProgress", recordingInProgress)
    if (recordingInProgress) {
      stopRecording()
      console.log("stop recording")
      // recorderService.em.removeEventListener("recording", console.log)
    } else {
      console.log("startRecording")
      // recorderService.em.addEventListener("recording", console.log)
      recorderService.em.addEventListener("recording", handleRecording as any)
      startRecording()
    }

    if (inputMode === null) {
      setInputMode("audio")
    } else if (inputMode === "audio") {
      setInputMode("audio-title")
    }
  }

  const startRecording = () => {
    if (recorderService == null) {
      return
    }
    recorderService.config.stopTracksAndCloseCtxWhenFinished = true
    recorderService.config.createDynamicsCompressorNode = false
    recorderService.config.enableEchoCancellation = true
    recorderService
      .startRecording()
      .then(() => {
        setRecordingInProgress(true)
      })
      .catch((err: any) => {
        console.error(err)
      })
  }

  const stopRecording = () => {
    if (recorderService == null) {
      return
    }
    recorderService.stopRecording()
    setRecordingInProgress(false)
  }

  const submitAudio = async () => {
    // TODO: submit audio comment
    setInputMode(null)
  }

  useEffect(() => {
    if (inputMode == null) {
      setVolumes([])
      setRecordingInProgress(false)
      setText("")
      setAudioTitle("")
      stopRecording()
    }
  }, [inputMode])

  useEffect(() => {
    if (inputMode == "text") {
      textAreaRef.current?.focus?.()
    } else if (inputMode === "audio-title") {
      audioTitleRef.current?.focus?.()
    }
  }, [inputMode])

  const modifiedVolumes = useMemo(() => {
    const maxValue = Math.max(...volumes)
    if (0.25 < maxValue) {
      return volumes.map((v) => v / maxValue)
    } else {
      return volumes
    }
  }, [volumes])

  return (
    <section
      className={
        "bg-black rounded-2xl w-[420px] pb-4 flex flex-col items-center max-h-[540px] " +
        className
      }
    >
      <div className="flex flex-col items-start px-6 pb-2 space-y-4 overflow-y-scroll">
        {comments.map((comment) =>
          comment.dataType === "audio" ? (
            <div className="first:mt-8 last:mb-8">
              <AudioComment key={comment.id} comment={comment} />
            </div>
          ) : (
            <div key={comment.id} className="ml-14 first:mt-8 last:mb-8">
              <TextComment comment={comment} />
            </div>
          ),
        )}
      </div>
      <div
        className="flex flex-col flex-shrink-0 w-full mt-2 space-y-4 overflow-hidden transition-all bg-black bottom-full rounded-tl-2xl rounded-tr-2xl"
        style={{
          height:
            inputMode === null
              ? 0
              : inputMode === "text"
              ? 100
              : inputMode === "audio-title"
              ? 120
              : 160,
        }}
      >
        {inputMode != null && (
          <div className="flex items-center justify-between px-8">
            <div className="flex-1" />
            <div className="flex-1">
              <div className="mx-auto w-16 h-1.5 bg-gray-400 rounded-full" />
            </div>
            <div className="flex-1">
              <button
                className="flex items-center justify-center flex-1 w-6 h-6 ml-auto leading-none transition rounded-full hover:bg-white/10 text-white/70"
                onClick={() => setInputMode(null)}
              >
                ×
              </button>
            </div>
          </div>
        )}
        {inputMode === "audio-title" ? (
          <div className="flex flex-col items-center space-y-2 w-[300px] mx-auto">
            <input
              type="text"
              placeholder="音声タイトルを入力"
              className="w-full text-sm leading-normal bg-black outline-none text-white/90"
              ref={audioTitleRef}
              value={audioTitle}
              onChange={(e) => setAudioTitle(e.target.value)}
            />
            <div>
              <AudioGraph
                data={modifiedVolumes}
                progress={1}
                width={Math.min(300, 6 * (modifiedVolumes.length ?? 0))}
                height={60}
                className=""
                disableHoverStyle
              />
            </div>
          </div>
        ) : inputMode === "audio" ? (
          <div className="relative flex">
            <AudioGraph
              data={modifiedVolumes}
              progress={1}
              width={6 * (modifiedVolumes.length ?? 0)}
              height={100}
              className="absolute right-0 pl-8 transition-all"
              disableHoverStyle
            />
          </div>
        ) : inputMode === "text" ? (
          <div className="px-8">
            <textarea
              placeholder="コメントを入力"
              className="w-full text-lg leading-normal bg-black outline-none resize-none text-white/90"
              ref={textAreaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        ) : null}
      </div>
      <section className="relative flex items-center justify-between w-full mt-4">
        <div className="flex items-center justify-center flex-1 text-sm">
          <button
            className={
              "mr-2 select-none text-white/70 transition " +
              (inputMode != null ? "" : "opacity-0")
            }
            disabled={inputMode == null}
            onClick={() => {
              if (inputMode === "audio-title") {
                setInputMode("audio")
                setVolumes([])
                setRecordingInProgress(false)
                handleClickBtnRecording()
              } else {
                setInputMode(null)
              }
            }}
          >
            {inputMode === "audio-title" ? "やり直し" : "キャンセル"}
          </button>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div
            className={
              "w-14 h-14 p-[3px] bg-white rounded-full transition transform " +
              (inputMode === "audio" ? "bg-transparent" : "") +
              (inputMode === "audio" || inputMode == null
                ? ""
                : "translate-y-8 opacity-0")
            }
          >
            <button
              aria-label="録音"
              className={
                "w-full h-full bg-red-500 border-[3px] border-black border-solid rounded-full bg-record-button transition-all " +
                (inputMode === "audio"
                  ? "rounded w-8 h-8 border-transparent "
                  : "")
              }
              onClick={handleClickBtnRecording}
              disabled={inputMode === "text"}
              data-recording-in-progress={String(recordingInProgress || false)}
            />
          </div>
        </div>
        <div className="flex items-center justify-center flex-1">
          <button
            onClick={() => {
              if (inputMode === null) {
                // テキスト
                setInputMode("text")
              } else if (inputMode === "audio-title") {
                // 送信
                setInputMode(null)
                submitAudio()
              } else {
                // 送信
                setInputMode(null)
              }
            }}
            className={
              "mr-2 select-none text-white/70 transition group " +
              (inputMode === "text" ? "" : "") +
              (inputMode === "audio" ? "opacity-0" : "")
            }
            disabled={
              inputMode === "audio" ||
              (inputMode === "text" && text === "") ||
              (inputMode === "audio-title" && audioTitle === "")
            }
          >
            {inputMode === null ? (
              <>
                <span className="inline-block mr-2 text-xl">Aa</span>
                <span className="inline-block text-xs">テキスト</span>
              </>
            ) : inputMode === "audio" ? (
              <span className="inline-block text-sm">次へ</span>
            ) : inputMode === "audio-title" ? (
              <span className="inline-block text-sm group-disabled:text-primary/50 text-primary">
                送信
              </span>
            ) : (
              <span className="inline-block text-sm group-disabled:text-primary/50 text-primary">
                送信
              </span>
            )}
          </button>
        </div>
      </section>
    </section>
  )
}

export default Thread