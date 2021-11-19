import LoadingIcon from "@components/atoms/LoadingIcon"
import PrimaryButton from "@components/atoms/PrimaryButton"
import GoogleDrivePicker from "@components/components/GoogleDrivePicker"
import { useFile } from "@hooks/useFile"
import { NextPage } from "next"
import { useRouter } from "next/router"
import React, { ChangeEvent, useState } from "react"
import Image from "next/image"
import GooglePicker from "react-google-picker"

export const FileUploader: NextPage = () => {
  const router = useRouter()
  const fileUseCase = useFile()
  const [pdf, setPdf] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  const handleFileName = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const inputValue = event.target.value
    setFileName(inputValue)
  }

  // ローカルからPDFを追加する
  const imageHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.target.files == null) {
      return
    }
    const file = event.target.files[0]
    if (file == null) {
      return
    }
    setPdf(file)

    // タイトルが未入力の場合はファイル名をセットする
    if (fileName.length === 0) {
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (pdf == null) {
      return
    }

    setIsUploading(true)
    const res = await fileUseCase
      .uploadFile({
        file: pdf,
        name: fileName,
      })
      .finally(() => setIsUploading(false))

    router.push(`/${res.file.id}`)
  }

  const fileUi = (
    <div className="flex items-center">
      <div className="container max-w-sm mx-auto overflow-hidden transition duration-300 bg-white shadow-xl p-9 rounded-2xl hover:shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="pr-2">
            <h1 className="mt-5 text-2xl font-semibold text-gray-500">
              {pdf?.name}
            </h1>
            <p className="mt-2 text-gray-500">{pdf?.size} bytes</p>
          </div>
          <div>
            <button
              className="px-2 py-2 font-semibold text-white transition duration-500 bg-red-400 rounded-lg shadow-md text-md hover:shadow-lg transform-gpu hover:scale-110 disabled:bg-gray-400"
              onClick={() => setPdf(null)}
              disabled={isUploading}
            >
              remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
  return (
    <>
      <div className="relative flex items-center justify-center sm:px-6">
        {isUploading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <LoadingIcon size={"48px"} />
          </div>
        )}
        <div className="z-10 w-full p-10 bg-white sm:max-w-lg rounded-xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              PDF アップロード
            </h2>
          </div>
          <form className="mt-8 space-y-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 space-y-2">
              <label className="text-sm font-bold tracking-wide text-gray-500">
                PDF名
              </label>
              <input
                className="p-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                type=""
                name="title"
                value={fileName}
                onChange={handleFileName}
                placeholder="エンジニア議事録"
              />
            </div>
            <div className="relative grid grid-cols-1 p-4 space-y-2 border-4 border-dashed rounded-lg">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full py-4 text-center group">
                  <div className="flex flex-col items-center justify-center w-full h-full text-center ">
                    {pdf ? (
                      <> {fileUi}</>
                    ) : (
                      <p className="leading-snug text-gray-500 pointer-none">
                        ファイルをドラッグ&ドロップ
                        <br />
                        or
                        <br />
                        <span className="text-blue-500 underline cursor-pointer">
                          ファイルを選択
                        </span>
                      </p>
                    )}
                  </div>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf"
                    name="file"
                    onChange={(e) => imageHandler(e)}
                  />
                </label>
              </div>
              <hr className="mx-8 border-t-2" />
              <GoogleDrivePicker
                onChange={({ file, name }) => {
                  setPdf(file)
                  setFileName(name)
                }}
              >
                <div className="flex items-center justify-center py-4 space-x-2 text-blue-500 underline cursor-pointer">
                  <Image src="/drive.png" alt="" width="32px" height="32px" />
                  <p>Google Driveからインポート</p>
                </div>
              </GoogleDrivePicker>
            </div>
            <div className="w-full mt-4 text-center">
              <PrimaryButton
                disabled={fileName == "" || pdf == null || isUploading}
              >
                {isUploading ? <LoadingIcon /> : "OK"}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
