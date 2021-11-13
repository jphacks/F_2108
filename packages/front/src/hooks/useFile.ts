import { FileDataSnapshot } from "@domain/fileDataSnapshot"
import {
  CommentRequestBody,
  CommentResponse,
  FileUseCase,
  GetDetailResponse,
  StampRequestBody,
  StampResponse,
  UploadRequestBody,
} from "@useCase/file/fileUseCase"
import { getClient } from "@lib/restClient/restClient"
import { errorHandler } from "@lib/ErrorHandler"
import { useAuthUser } from "./useAuth"
import { getStorageClient } from "@lib/storageClient/storageClient"
import { MockFileUseCase } from "@mocks/useCase/file/mockFileUseCase"

type UseFile = {
  uploadFile: (body: UploadRequestBody) => Promise<FileDataSnapshot>
  fetchFileList: () => Promise<FileDataSnapshot[]>
  fetchFileDetail: (fileId: string) => Promise<GetDetailResponse>
  postStamp: (body: StampRequestBody, fileId: string) => Promise<StampResponse>
  postComment: (
    body: CommentRequestBody,
    fileId: string,
    stampId: string,
  ) => Promise<CommentResponse>
}

/** モックを利用するか */
const USE_MOCK = false

export const useFile = (): UseFile => {
  const user = useAuthUser()
  const apiClient = getClient()
  const storageClient = getStorageClient()
  const fileUseCase =
    USE_MOCK && process.env.NODE_ENV === "development"
      ? new MockFileUseCase()
      : new FileUseCase(apiClient, storageClient)

  user?.getIdToken().then((idToken) => {
    apiClient.setIdToken(idToken)
  })

  const uploadFile = async (body: UploadRequestBody) => {
    return await fileUseCase
      .upload(body)
      .catch((error: Error) => errorHandler({ error }))
  }

  const fetchFileList = async () => {
    return await fileUseCase
      .getList()
      .catch((error: Error) => errorHandler({ error }))
  }

  const fetchFileDetail = async (fileId: string) => {
    return await fileUseCase
      .getDetail(fileId)
      .catch((error: Error) => errorHandler({ error }))
  }

  const postStamp = async (body: StampRequestBody, fileId: string) => {
    return await fileUseCase
      .stamp(body, fileId)
      .catch((error: Error) => errorHandler({ error }))
  }

  const postComment = async (
    body: CommentRequestBody,
    fileId: string,
    stampId: string,
  ) => {
    return await fileUseCase
      .comment(body, fileId, stampId)
      .catch((error: Error) => errorHandler({ error }))
  }

  return {
    uploadFile,
    fetchFileList,
    fetchFileDetail,
    postStamp,
    postComment,
  }
}
