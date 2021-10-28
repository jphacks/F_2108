import { ChangeEvent, useState } from "react"

export const FileUploader = () => {
  const [pdf, setPdf] = useState<string>()
  const [fileName, setFileName] = useState<string>()

  const handleValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const inputValue = event.target.value
    setFileName(inputValue)
  }

  // ローカルからPDFを追加する
  const imageHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) {
      return
    }
    const file = event.target.files[0]
    if (file === null) {
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file as Blob)
    reader.onload = () => {
      setPdf(reader.result as string)
    }
  }

  // TODO:アップロード素材
  console.log(pdf)
  console.log(fileName)
  return (
    <>
      <div className="relative flex items-center justify-center  sm:px-6 relative items-center">
        <div className="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              PDF アップロード
            </h2>
          </div>
          <form className="mt-8 space-y-3" action="#" method="POST">
            <div className="grid grid-cols-1 space-y-2">
              <label className="text-sm font-bold text-gray-500 tracking-wide">
                PDF名
              </label>
              <input
                className="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                type=""
                value={fileName}
                onChange={(e) => {
                  handleValueChange(e)
                }}
                placeholder="エンジニア議事録"
              />
            </div>
            <div className="grid grid-cols-1 space-y-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                  <div className="h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                    <p className="pointer-none text-gray-500 ">
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
          </form>
        </div>
      </div>
    </>
  )
}
