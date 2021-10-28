import { ListElement } from "@components/organisms/listElement"
import { AddButton } from "@components/organisms/addButton"
import { Modal } from "@components/organisms/modal"
import { useEffect, useState } from "react"
import { FileUploader } from "@components/organisms/fileUploader"
import Image from "next/image"
import { SearchInput } from "@components/organisms/searchInput"
import { useAuth } from "@hooks/useAuth"
import { useRouter } from "next/router"
import { useRequest } from "@hooks/useRequest"
import { useFile } from "@hooks/useFile"

const Index: React.VFC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const user = useAuth()
  const router = useRouter()
  const fileUseCase = useFile()

  useEffect(() => {
    !user && router.push("/login")
  }, [user])

  const { data: files } = useRequest(() => fileUseCase.fetchFileList(), [])

  //TODO:ここのsearchNameを使い配列をfilterする
  const [searchName, setSearchName] = useState<string>("")

  const openModal = () => {
    setIsOpenModal(!isOpenModal)
  }

  return (
    <body className="h-screen bg-gray-200">
      <Modal
        isOpen={isOpenModal}
        body={
          <div>
            <FileUploader />
          </div>
        }
        onClick={openModal}
      />
      <header className="w-full text-gray-100 bg-black shadow body-font">
        <div className="container flex flex-col flex-wrap items-center p-4 md:flex-row ">
          <Image
            src="/logo.png"
            width={180}
            height={80}
            className="w-full object-fit"
          />
          <div className="flex ml-12 justify-first">
            <SearchInput setter={setSearchName} value={searchName} />
          </div>
        </div>
      </header>
      <div className="mt-4 ml-20">
        <AddButton onClick={openModal} />
      </div>
      <div className="mx-auto">
        <ul className="grid w-2/3 gap-6 mx-auto sm:grid-cols-2 xl:grid-cols-3">
          {files.map((file) => (
            <li key={file.file.id} className="mx-auto">
              <ListElement file={file} />
            </li>
          ))}
        </ul>
      </div>
    </body>
  )
}
export default Index
