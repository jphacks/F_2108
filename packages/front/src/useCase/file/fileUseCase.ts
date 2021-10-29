import { RestClientInterface } from "@lib/restClient/restClient"
import { FileDataSnapshot } from "@domain/fileDataSnapshot"
import { Stamp } from "@domain/stamp"
import { User } from "@domain/user"
import { Position } from "@domain/position"
import { Comment } from "@domain/comment"

export type UploadRequestBody = {
  file: Blob
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
  content: string
  author: User
  postedAt: string
} & (
  | {
      dataType: "text"
      title?: undefined
    }
  | {
      dataType: "audio"
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
  constructor(private readonly restClient: RestClientInterface) {}

  public async upload(body: UploadRequestBody): Promise<FileDataSnapshot> {
    try {
      const form = new FormData()
      form.append("file", body.file)
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
    form.append("x", body.x)
    form.append("y", body.y)
    form.append("dataType", body.dataType)
    if ("title" in body) form.append("title", body.title)

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
