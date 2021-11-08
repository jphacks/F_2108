import { RestClientInterface } from "@lib/restClient/restClient"
import { FileDataSnapshot } from "@domain/fileDataSnapshot"
import { Stamp } from "@domain/stamp"
import { User } from "@domain/user"
import { Position } from "@domain/position"
import { Comment } from "@domain/comment"
import { StorageClientInterface } from "@lib/storageClient/storageClient"
import { v4 as uuid } from "uuid"

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
      content: Blob
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
      content: Blob
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
  content: string
} & (
  | {
      dataType: "text"
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
  constructor(
    private readonly restClient: RestClientInterface,
    private readonly storageClient: StorageClientInterface,
  ) {}

  public async upload(body: UploadRequestBody): Promise<FileDataSnapshot> {
    try {
      const path = await this.storageClient.upload(
        body.file,
        `file/${uuid()}_${body.name}`,
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
    const res = await this.restClient.get<FileDataSnapshot[]>(`/file`)
    return res.map((file) => ({
      ...file,
      updatedBy: file.updatedBy,
    }))
  }

  public async getDetail(fileId: string): Promise<GetDetailResponse> {
    const res = await this.restClient.get<GetDetailResponse>(`/file/${fileId}`)
    return {
      ...res,
      stamps: res.stamps.map((stamp) => ({
        ...stamp,
        id: `${stamp.id}`,
        comments: stamp.comments.map((comment) => ({
          ...comment,
          id: `${comment.id}`,
        })),
      })),
    }
  }

  public async stamp(
    body: StampRequestBody,
    fileId: string,
  ): Promise<StampResponse> {
    const content =
      body.dataType === "audio"
        ? await this.storageClient.upload(
            body.content,
            `audio/${uuid()}`,
            "audio/wav",
          )
        : body.content
    const form = new FormData()
    form.append("page", body.page)
    form.append("x", body.x)
    form.append("y", body.y)
    form.append("dataType", body.dataType)
    form.append("content", content)
    if ("title" in body) form.append("title", body.title)

    const res = await this.restClient.postForm<StampResponse>(
      `/file/${fileId}/stamp`,
      form,
    )
    return {
      ...res,
      id: `${res.id}`,
      comments: res.comments.map((comment) => ({
        ...comment,
        id: `${comment.id}`,
      })),
    }
  }

  public async comment(
    body: CommentRequestBody,
    fileId: string,
    stampId: string,
  ): Promise<CommentResponse> {
    const content =
      body.dataType === "audio"
        ? await this.storageClient.upload(
            body.content,
            `audio/${uuid()}`,
            "audio/wav",
          )
        : body.content
    const form = new FormData()
    form.append("dataType", body.dataType)
    form.append("content", content)
    if ("title" in body) form.append("title", body.title)
    const res = await this.restClient.postForm<CommentResponse>(
      `/file/${fileId}/stamp/${stampId}/comment`,
      form,
    )

    return { ...res, id: `${res.id}` }
  }
}
