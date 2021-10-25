import { useEffect, useState } from "react"
import RecorderService from "../lib/js/RecordService"
import axios from "axios"

interface Recording {
  ts: number
  blobUrl: string
  mimeType: string
  size: number
}

const audioPlay = () => {
  const [recorderService, setRecorderService] = useState<any>(null)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [recordingInProgress, setRecordingInProgress] = useState<boolean>()

  useEffect(() => {
    if (recorderService) {
      window.addEventListener("keypress", handleKeypress)

      return
    }

    setRecorderService(new RecorderService())
  }, [recorderService])

  const handleRecording = (evt: { detail: { recording: Recording } }) => {
    onNewRecording(evt)
  }

  const handleKeypress = () => {
    window.removeEventListener("keypress", handleKeypress)
    handleClickBtnRecording()
  }

  const handleClickBtnRecording = () => {
    if (recordingInProgress) {
      stopRecording()
      recorderService.em.removeEventListener("recording", handleRecording)
    } else {
      recorderService.em.addEventListener("recording", handleRecording)
      startRecording()
    }
  }

  const startRecording = () => {
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
    recorderService.stopRecording()
    setRecordingInProgress(false)
  }

  const onNewRecording = (evt: { detail: { recording: Recording } }) => {
    setRecordings([...recordings, evt.detail.recording])
  }

  console.log(recordings.map((r) => r.blobUrl))

  // Blob形式でサーバーにアップロードする
  // HACK:使っているライブラリでBlobを隠蔽し、Blob URLを返しているので、再変換する必要がある
  // https://github.com/kaliatech/web-audio-recording-tests
  // 例外処理なので作成したRestClientは使っていない
  const blobUrlTransPile = async (url: string) => {
    return await axios
      .get<string>(url, {
        responseType: "blob",
      })
      .then(({ data }) => {
        console.log(data) // Blob URL → Blob
        console.log(URL.createObjectURL(data)) // Blob → Blob URL
        return data // Blob URL → Blob
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <div className="inner">
      <ol>
        {recordings.map((recording) => {
          if (!recording.ts) {
            return <div />
          }

          return (
            <li key={recording.ts}>
              {console.log(recording.blobUrl)}
              <audio src={recording.blobUrl} controls />
            </li>
          )
        })}
      </ol>
      <footer>
        <button
          onClick={handleClickBtnRecording}
          data-recording-in-progress={String(recordingInProgress || false)}
          className="btn-recording bg-red-500 text-white rounded-lg p-4 font-bold"
        >
          {recordingInProgress ? "録音停止" : "録音開始"}
        </button>
      </footer>
    </div>
  )
}

export default audioPlay
