import { RestClientInterface } from "@lib/restClient/restClient"
import { FileDataSnapshot } from "@domain/fileDataSnapshot"
import { Stamp } from "@domain/stamp"
import { User } from "@domain/user"
import { Position } from "@domain/position"
import { StorageClientInterface } from "@lib/storageClient/storageClient"

export type UploadRequestBody = {
  file: File
  name: string
}

export type StampRequestBody = {
  page: string
  x: string
  y: string
} & (
  | {
      dataType: "audio"
      content: File
      title: string
    }
  | {
      dataType: "text"
      content: string
    }
)

export type CommentRequestBody =
  | {
      dataType: "audio"
      content: File
      title: string
    }
  | {
      dataType: "text"
      content: string
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
  id: string
  author: User
  postedAt: string
} & (
  | {
      dataType: "text"
      content: string
    }
  | {
      dataType: "audio"
      content: string
      title: string
    }
)

export type FileUseCaseInterface = {
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
  constructor(
    private readonly restClient: RestClientInterface,
    private readonly storageClient: StorageClientInterface,
  ) {}

  public async upload(body: UploadRequestBody): Promise<FileDataSnapshot> {
    try {
      const path = await this.storageClient.upload(
        body.file,
        `file/${body.name}`,
        "application/pdf",
      )
      const form = new FormData()
      form.append("file", path)
      form.append("name", body.name)
      return await this.restClient.postForm<FileDataSnapshot>(`/file`, form)
    } catch (e) {
      console.log(e)
      throw e
    }
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
    const form = new FormData()
    form.append("file", body.page)
    form.append("file", body.x)
    form.append("file", body.y)
    form.append("file", body.dataType)
    if ("title" in body) form.append("file", body.title)

    return await this.restClient.postForm<StampResponse>(
      `/file/${fileId}`,
      form,
    )
  }

  public async comment(
    body: CommentRequestBody,
    fileId: string,
    stampId: string,
  ): Promise<CommentResponse> {
    const form = new FormData()
    form.append("dataType", body.dataType)
    form.append("content", body.content)
    if ("title" in body) form.append("file", body.title)
    return await this.restClient.postForm<CommentResponse>(
      `/file/${fileId}/stamp/${stampId}/comment`,
      form,
    )
  }
}
