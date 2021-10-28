import { ListElement } from "@components/organisms/listElement"
import { dummyFileList } from "@mocks/testListDate"
import { AddButton } from "@components/organisms/addButton"
import { Modal } from "@components/organisms/modal"
import { useState } from "react"
import { FileUploader } from "@components/organisms/fileUploader"
import Image from "next/image"
import { SearchInput } from "@components/organisms/searchInput"

const Index: React.VFC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)

  //TODO:ここのsearchNameを使い配列をfilterする
  const [searchName, setSearchName] = useState<string>("")

  const openModal = () => {
    setIsOpenModal(!isOpenModal)
  }
  return (
    <body className="bg-gray-200 h-screen">
      <Modal
        isOpen={isOpenModal}
        body={
          <div>
            <FileUploader />
          </div>
        }
        onClick={openModal}
      />
      <header className="text-gray-100 bg-black body-font shadow w-full">
        <div className="container flex flex-wrap p-4 flex-col md:flex-row items-center ">
          <Image
            src="/logo.png"
            width={180}
            height={80}
            className="object-fit w-full"
          />
          <div className="flex justify-first ml-12">
            <SearchInput setter={setSearchName} value={searchName} />
          </div>
        </div>
      </header>
      <div className="ml-20 mt-4">
        <AddButton onClick={openModal} />
      </div>
      <div className="mx-auto">
        <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 w-2/3 mx-auto">
          {dummyFileList.map((fl) => (
            <li key={fl.id} className="mx-auto">
              <ListElement
                name={fl.name}
                thumbnail={fl.thumbnail}
                editDate={fl.editDate}
                editUser={fl.editUser}
                nextPage={() => {
                  console.log("next_page")
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </body>
  )
}
export default Index
