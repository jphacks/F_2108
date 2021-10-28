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
import { useAuth } from "./useAuth"

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

export const useFile = (): UseFile => {
  const user = useAuth()
  const apiClient = getClient()
  const fileUseCase = new FileUseCase(apiClient)

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
