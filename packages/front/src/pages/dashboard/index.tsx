import { ListElement } from "@components/organisms/listElement"
import { AddButton } from "@components/organisms/addButton"
import { Modal } from "@components/organisms/modal"
import { useEffect, useMemo, useState } from "react"
import { FileUploader } from "@components/organisms/fileUploader"
import Image from "next/image"
import { SearchInput } from "@components/organisms/searchInput"
import { useAuthUser } from "@hooks/useAuth"
import { useRouter } from "next/router"
import { useRequest } from "@hooks/useRequest"
import { useFile } from "@hooks/useFile"
import { authUseCase } from "@useCase"

const Index: React.VFC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const user = useAuthUser()
  const router = useRouter()
  const fileUseCase = useFile()

  useEffect(() => {
    !user && router.push("/")
  }, [user])

  const { data: files } = useRequest(() => fileUseCase.fetchFileList(), [])

  const [searchName, setSearchName] = useState<string>("")

  const openModal = () => {
    setIsOpenModal(!isOpenModal)
  }

  const handleLogout = () => {
    authUseCase.logout()
  }

  const sortedFiles = useMemo(() => {
    const _files = files.filter((file) => file.file.name.startsWith(searchName))
    _files.sort((a, b) => {
      const aTime = new Date(a.updatedAt).getTime()
      const bTime = new Date(b.updatedAt).getTime()
      return aTime < bTime ? 1 : aTime === bTime ? 0 : -1
    })
    return _files
  }, [files])

  return (
    <div className="h-screen bg-gray-200">
      <Modal
        isOpen={isOpenModal}
        body={
          <div>
            <FileUploader />
          </div>
        }
        onClick={openModal}
      />
      <header className="w-full h-[80px] text-gray-100 bg-black shadow body-font px-16 py-4">
        <div className="container flex flex-col flex-wrap items-center h-full md:flex-row">
          <div className="relative flex-1 flex-shrink-0">
            <Image
              src="/logo.png"
              className="object-fit"
              width={(50 * 289) / 100}
              height={50}
            />
          </div>
          <div className="flex-1 h-full">
            <SearchInput setter={setSearchName} value={searchName} />
          </div>
          <div className="flex justify-end flex-1 flex-shrink-0 h-full">
            <button
              className="h-full px-4 ml-auto transition rounded-lg hover:bg-white/10 focus:bg-white/10"
              onClick={handleLogout}
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>
      <div className="mt-4 ml-20">
        <AddButton onClick={openModal} />
      </div>
      <div className="mx-auto mt-4">
        <ul className="grid w-2/3 gap-6 mx-auto sm:grid-cols-2 xl:grid-cols-3">
          {sortedFiles.map((file) => (
            <li key={file.file.id}>
              <ListElement file={file} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
export default Index
