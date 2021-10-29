import PrimaryButton from "@components/atoms/PrimaryButton"
import { useFile } from "@hooks/useFile"
import { NextPage } from "next"
import { useRouter } from "next/router"
import React, { ChangeEvent, useState } from "react"

export const FileUploader: NextPage = () => {
  const router = useRouter()
  const fileUseCase = useFile()
  const [pdf, setPdf] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string>("")

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
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (pdf == null) {
      return
    }
    console.log("upload")
    const res = await fileUseCase.uploadFile({
      file: pdf,
      name: fileName,
    })

    // router.push(`/${res.file.id}`)
  }

  return (
    <>
      <div className="relative flex items-center justify-center sm:px-6">
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
                value={fileName}
                onChange={handleFileName}
                placeholder="エンジニア議事録"
              />
            </div>
            <div className="grid grid-cols-1 space-y-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full p-10 text-center border-4 border-dashed rounded-lg h-60 group">
                  <div className="flex flex-col items-center justify-center w-full h-full text-center ">
                    <p className="text-gray-500 pointer-none ">
                      <span className="text-sm">Drag and drop</span> files here{" "}
                      <br /> or{" "}
                      <a
                        href=""
                        id=""
                        className="text-blue-600 hover:underline"
                      >
                        select a file
                      </a>{" "}
                      from your computer
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => imageHandler(e)}
                  />
                </label>
              </div>
            </div>
            <div className="w-full mt-4 text-center">
              <PrimaryButton disabled={fileName == "" || pdf == null}>
                OK
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
