import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Comment } from "@domain/comment"
import { TextComment } from "./TextComment"
import AudioComment, { AudioWavePropsRefType } from "./AudioComment"
import RecorderService from "@lib/js/RecordService"
import dynamic from "next/dynamic"
import { Play, Square } from "react-feather"
import PermissionModal from "@components/organisms/PermissionModal"
const AudioGraph = dynamic(() => import("@components/atoms/AudioGraph"), {
  ssr: false,
})

type Thread = {
  comments: Comment[]
  onAddComment: (
    comment:
      | { dataType: "audio"; content: Blob; title: string }
      | { dataType: "text"; content: string },
  ) => void
  isAuthed: boolean
  className?: string
  isOpened?: boolean
}

type Recording = {
  ts: number
  blobUrl: string
  blob: Blob
  mimeType: string
  size: number
}

const Thread: React.VFC<Thread> = ({
  comments,
  onAddComment,
  isOpened,
  isAuthed,
  className,
}) => {
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
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  useEffect(() => {
    const _recorderService = new RecorderService((volume: number) => {
      setVolumes((prev) => [...prev, volume])
    })
    setRecorderService(_recorderService)
  }, [])

  const handleRecording = useCallback(
    async (evt: { detail: { recording: Recording } }) => {
      setAudioBlob(evt.detail.recording.blob)
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
    if (recordingInProgress) {
      stopRecording()
      // recorderService.em.removeEventListener("recording", console.log)
    } else {
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
    if (audioBlob == null) {
      return
    }
    onAddComment({
      content: audioBlob,
      dataType: "audio",
      title: audioTitle,
    })
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
        "bg-black rounded-2xl w-[420px] pb-4 flex flex-col items-center shadow-paper " +
        className
      }
    >
      <CommentsArea isOpened={isOpened} comments={comments} />
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
                ??
              </button>
            </div>
          </div>
        )}
        {inputMode === "audio-title" ? (
          <div className="flex flex-col items-center space-y-2 w-[300px] mx-auto">
            <input
              type="text"
              placeholder="???????????????????????????"
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
              placeholder="?????????????????????"
              className="w-full text-lg leading-normal bg-black outline-none resize-none text-white/90"
              ref={textAreaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        ) : null}
      </div>
      {comments.length === 0 &&
        (inputMode == null || inputMode === "audio") && (
          <div className="text-white">?????????????????????????????????</div>
        )}
      {isAuthed ? (
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
              {inputMode === "audio-title" ? "????????????" : "???????????????"}
            </button>
          </div>
          <div className="flex items-center justify-center flex-1">
            <div
              className={
                "w-14 h-14 p-[3px] bg-white rounded-full transition transform " +
                (inputMode === "audio" ? "bg-transparent " : "") +
                (inputMode === "audio" || inputMode == null
                  ? ""
                  : "translate-y-8 opacity-0")
              }
            >
              <button
                aria-label="??????"
                className={
                  "w-full h-full bg-red-500 border-[3px] border-black border-solid bg-record-button transition-all " +
                  (inputMode === "audio"
                    ? "rounded w-8 h-8 border-transparent "
                    : "rounded-full ")
                }
                onClick={handleClickBtnRecording}
                disabled={inputMode === "text"}
                data-recording-in-progress={String(
                  recordingInProgress || false,
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-center flex-1">
            {!(inputMode === null && comments.length === 0) && (
              <button
                onClick={() => {
                  if (inputMode === null) {
                    // ????????????
                    setInputMode("text")
                  } else if (inputMode === "audio-title") {
                    // ??????
                    submitAudio()
                    setInputMode(null)
                  } else if (inputMode === "text") {
                    // ??????
                    onAddComment({ dataType: "text", content: text })
                    setInputMode(null)
                  } else {
                    // unreachable
                    return
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
                    <span className="inline-block text-xs">????????????</span>
                  </>
                ) : inputMode === "audio" ? (
                  <span className="inline-block text-sm">??????</span>
                ) : inputMode === "audio-title" ? (
                  <span className="inline-block text-sm group-disabled:text-primary/50 text-primary">
                    ??????
                  </span>
                ) : (
                  <span className="inline-block text-sm group-disabled:text-primary/50 text-primary">
                    ??????
                  </span>
                )}
              </button>
            )}
          </div>
        </section>
      ) : (
        <div className="my-2 text-sm text-white/60">
          ???????????????????????????????????????????????????????????????
        </div>
      )}
    </section>
  )
}

export default Thread

// ????????????????????????...
const CommentsArea: React.VFC<{ comments: Comment[]; isOpened?: boolean }> = ({
  comments,
  isOpened,
}) => {
  const audioRefs = useRef<Record<string, AudioWavePropsRefType | null>>({})
  // state???????????????????????????????????????, state???ref???????????????????????????><
  const isSequencePlaying = useRef(false)
  const [isSeqPlaying, setIsSeqPlaying] = useState(false)

  useEffect(() => {
    if (!isOpened) {
      setIsSeqPlaying(false)
      isSequencePlaying.current = false
      window.speechSynthesis.cancel()
      sortedComment.map((comment) => {
        audioRefs.current[comment.id]?.pause()
      })
    }
  }, [isOpened])

  const handleOnPlayEnd = (index: number) => {
    if (!isSequencePlaying.current) {
      return
    }
    const nextComment = comments[index + 1]
    if (nextComment == null) {
      isSequencePlaying.current = false
      setIsSeqPlaying(false)
      return
    }

    setTimeout(() => {
      if (nextComment.dataType === "audio") {
        audioRefs.current[nextComment.id]?.play()
      } else {
        const speech = new SpeechSynthesisUtterance()
        speech.addEventListener("end", () => {
          handleOnPlayEnd(index + 1)
        })
        speech.addEventListener("error", () => {
          handleOnPlayEnd(index + 1)
        })
        speech.text = nextComment.content
        speech.lang = "ja-JP"
        window.speechSynthesis.speak(speech)
      }
    }, 500)
  }

  const sortedComment = useMemo(() => {
    const array = [...comments]
    array.sort((a, b) => {
      const aTime = new Date(a.postedAt).getTime()
      const bTime = new Date(b.postedAt).getTime()
      return aTime > bTime ? 1 : aTime === bTime ? 0 : -1
    })
    return array
  }, [comments])

  const handleStartSequencePlay = () => {
    window.speechSynthesis.cancel()
    sortedComment.map((comment) => {
      audioRefs.current[comment.id]?.pause()
    })
    if (isSequencePlaying.current) {
      isSequencePlaying.current = false
      setIsSeqPlaying(false)
    } else if (sortedComment[0] != null) {
      isSequencePlaying.current = true
      setIsSeqPlaying(true)
      audioRefs.current[sortedComment[0]?.id]?.play()
    }
  }

  return (
    <div className="flex flex-col items-start px-6 pb-2 space-y-4 overflow-y-scroll">
      {1 < comments.length && (
        <button
          className="flex items-center self-end px-4 py-1 mt-4 space-x-1 text-sm rounded-lg y-2 text-white/70 bg-white/10 focus:bg-white/20 hover:bg-white/20"
          onClick={handleStartSequencePlay}
        >
          {isSeqPlaying ? (
            <Square fill="currentColor" size="16px" />
          ) : (
            <Play fill="currentColor" size="16px" />
          )}
          <span>{isSeqPlaying ? "??????" : "????????????"}</span>
        </button>
      )}
      {sortedComment.map((comment, index) =>
        comment.dataType === "audio" ? (
          <div key={comment.id} className="first:mt-8 last:mb-8">
            <AudioComment
              ref={(ref) => {
                audioRefs.current[comment.id] = ref
              }}
              onClickStart={() => {
                isSequencePlaying.current = false
                setIsSeqPlaying(false)
                sortedComment
                  .filter(({ id }) => id !== comment.id)
                  .map((comment) => {
                    audioRefs.current[comment.id]?.pause()
                  })
                window.speechSynthesis.cancel()
              }}
              onClickPause={() => {
                setIsSeqPlaying(false)
                isSequencePlaying.current = false
              }}
              onPlayEnd={() => {
                handleOnPlayEnd(index)
              }}
              comment={comment}
            />
          </div>
        ) : (
          <div key={comment.id} className="ml-14 first:mt-8 last:mb-8">
            <TextComment comment={comment} />
          </div>
        ),
      )}
    </div>
  )
}
