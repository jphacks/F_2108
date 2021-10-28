import { RestClientInterface } from "@lib/restClient/restClient"
import { FileDataSnapshot } from "@domain/fileDataSnapshot"
import { Stamp } from "@domain/stamp"
import { User } from "@domain/user"
import { Position } from "@domain/position"

export type UploadRequestBody = {
  file: Blob
  name: string
}

export type StampRequestBody = {
  page: number
  x: number
  y: number
  dataType: string
  content: string
}

export type CommentRequestBody = {
  dataType: string
  content: string
  title: string
}

export type GetDetailResponse = {
  fileSnapshot: FileDataSnapshot
  stamps: Stamp[]
}

export type StampResponse = {
  title: string
  id: string
  author: User
  comments: Comment[]
  position: Position
}

export type CommentResponse = {
  title: string
  id: string
  dataType: string
  content: string
  author: User
  postedAt: string
}

type FileUseCaseInterface = {
  upload: (body: UploadRequestBody) => Promise<FileDataSnapshot>
  getList: () => Promise<FileDataSnapshot[]>
  getDetail: (fileId: string) => Promise<GetDetailResponse>
  stamp: (body: StampRequestBody, fileId: string) => Promise<StampResponse>
  comment: (
    body: CommentRequestBody,
    fileId: string,
    stampId: string,
  ) => Promise<CommentResponse>
}

export class FileUseCase implements FileUseCaseInterface {
  constructor(private readonly restClient: RestClientInterface) {}

  public async upload(body: UploadRequestBody): Promise<FileDataSnapshot> {
    return await this.restClient.post<UploadRequestBody, FileDataSnapshot>(
      `/file`,
      body,
      true,
    )
  }

  public async getList(): Promise<FileDataSnapshot[]> {
    return await this.restClient.get<FileDataSnapshot[]>(`/file`)
  }

  public async getDetail(fileId: string): Promise<GetDetailResponse> {
    return await this.restClient.get<GetDetailResponse>(`/file/${fileId}`)
  }

  public async stamp(
    body: StampRequestBody,
    fileId: string,
  ): Promise<StampResponse> {
    return await this.restClient.post<StampRequestBody, StampResponse>(
      `/file/${fileId}`,
      body,
      true,
    )
  }

  public async comment(
    body: CommentRequestBody,
    fileId: string,
    stampId: string,
  ): Promise<CommentResponse> {
    return await this.restClient.post<CommentRequestBody, CommentResponse>(
      `/file/${fileId}/stamp/${stampId}/comment`,
      body,
    )
  }
}
