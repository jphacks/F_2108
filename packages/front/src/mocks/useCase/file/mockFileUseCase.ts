import { FileDataSnapshot } from "@domain/fileDataSnapshot"
import {
  CommentRequestBody,
  CommentResponse,
  FileUseCaseInterface,
  GetDetailResponse,
  StampRequestBody,
  StampResponse,
  UploadRequestBody,
} from "@useCase/file/fileUseCase"
import { dummyUsers } from "@mocks/testUserData"
import { prevday } from "../testDateData"
import { stringIdGenerator } from "@mocks/testId"
import { Stamp } from "@domain/stamp"
import { Comment } from "@domain/comment"

const id = stringIdGenerator()
const stampId = stringIdGenerator()

export class MockFileUseCase implements FileUseCaseInterface {
  static stamps: Stamp[] = [
    {
      id: "0",
      author: dummyUsers[2],
      comments: [
        {
          id: "1",
          dataType: "audio",
          content: "/dog.wav",
          author: dummyUsers[2],
          postedAt: "2019-08-24T14:15:22Z",
          title: "タイトル",
        },
        {
          id: "2",
          dataType: "text",
          content:
            "とても長いコメント。とても長いコメント。とても長いコメント。とても長いコメント。とても長いコメント。とても長いコメント。とても長いコメント。とても長いコメント。",
          author: dummyUsers[3],
          postedAt: "2019-08-25T14:15:22Z",
        },
      ],
      position: {
        page: 1,
        x: 0.3,
        y: 0.45,
      },
    },
    {
      id: "1",
      author: dummyUsers[2],
      comments: [
        {
          id: "1",
          dataType: "audio",
          content: "/dog.wav",
          author: dummyUsers[2],
          postedAt: "2019-08-24T14:15:22Z",
          title: "タイトル",
        },
      ],
      position: {
        page: 1,
        x: 0.8,
        y: 0.2,
      },
    },
    {
      id: "2",
      author: dummyUsers[2],
      comments: [
        {
          id: "1",
          dataType: "audio",
          content: "/dog.wav",
          author: dummyUsers[2],
          postedAt: "2019-08-24T14:15:22Z",
          title: "タイトル",
        },
        {
          id: "2",
          dataType: "text",
          content:
            "とても長いコメント。とても長いコメント。とても長いコメント。とても長いコメント。とても長いコメント。とても長いコメント。とても長いコメント。とても長いコメント。",
          author: dummyUsers[3],
          postedAt: "2019-08-25T14:15:22Z",
        },
      ],
      position: {
        page: 2,
        x: 0.1,
        y: 0.9,
      },
    },
    {
      id: "4",
      author: {
        id: "qwerty",
        name: "joen doe",
        iconUrl: "/icons/icon01.png",
      },
      comments: [
        {
          id: "1",
          dataType: "audio",
          content: "/dog.wav",
          author: {
            id: "qwerty",
            name: "joen doe",
            iconUrl: "/icons/icon03.png",
          },
          postedAt: "2019-08-24T14:15:22Z",
          title: "タイトル",
        },
        {
          id: "2",
          dataType: "text",
          content: "コメント",
          author: {
            id: "qwerty",
            name: "joen doe",
            iconUrl: "/icons/icon02.png",
          },
          postedAt: "2019-08-25T14:15:22Z",
        },
      ],
      position: {
        page: 1,
        x: 0.8,
        y: 0.55,
      },
    },
  ]
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async upload(body: UploadRequestBody): Promise<FileDataSnapshot> {
    throw new Error("not implemented")
  }

  public async getList(): Promise<FileDataSnapshot[]> {
    return await Promise.resolve([
      {
        type: "own",
        file: {
          id: id.next().value,
          author: dummyUsers[0],
          name: "ファイル名.pdf",
          postedAt: prevday(2),
          url: "/sample.pdf",
          thumbnail: "/sample-thumbnail.jpeg",
        },
        updatedAt: prevday(1),
        updatedBy: dummyUsers[1],
      },
      {
        type: "shared",
        file: {
          id: id.next().value,
          author: dummyUsers[2],
          name: "とても長いファイル名とても長いファイル名とても長いファイル名とても長いファイル名とても長いファイル名.pdf",
          postedAt: prevday(4),
          url: "/sample.pdf",
          thumbnail: "/sample-thumbnail.jpeg",
        },
        updatedAt: prevday(1),
        updatedBy: dummyUsers[7],
      },
      {
        type: "own",
        file: {
          id: id.next().value,
          author: dummyUsers[7],
          name: "とても長いファイル名とても長いファイル名とても長いファイル名とても長いファイル名とても長いファイル名",
          postedAt: prevday(2),
          url: "/sample.pdf",
          thumbnail: "/sample-thumbnail.jpeg",
        },
        updatedAt: prevday(1),
        updatedBy: dummyUsers[1],
      },
      {
        type: "shared",
        file: {
          id: id.next().value,
          author: dummyUsers[2],
          name: "sample-thumbnail.pdf",
          postedAt: prevday(4),
          url: "/sample.pdf",
          thumbnail: "/sample-thumbnail.jpeg",
        },
        updatedAt: prevday(3),
        updatedBy: dummyUsers[3],
      },
      {
        type: "shared",
        file: {
          id: id.next().value,
          author: dummyUsers[2],
          name: "very.long.very.long.very.long.very.long.very.long.very.long.pdf",
          postedAt: prevday(8),
          url: "/sample.pdf",
          thumbnail: "/sample-thumbnail.jpeg",
        },
        updatedAt: prevday(4),
        updatedBy: dummyUsers[3],
      },
      {
        type: "own",
        file: {
          id: id.next().value,
          author: dummyUsers[0],
          name: "filename",
          postedAt: prevday(2),
          url: "/sample.pdf",
          thumbnail: "/sample-thumbnail.jpeg",
        },
        updatedAt: prevday(1),
        updatedBy: dummyUsers[1],
      },
    ])
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getDetail(fileId: string): Promise<GetDetailResponse> {
    return {
      fileSnapshot: {
        type: "own",
        file: {
          id: "string",
          author: dummyUsers[0],
          name: "filename",
          postedAt: "2019-08-24T14:15:22Z",
          url: "/sample.pdf",
          thumbnail: "/sample-thumbnail.jpeg",
        },
        updatedAt: "2019-08-24T14:15:22Z",
        updatedBy: dummyUsers[1],
      },
      stamps: [...MockFileUseCase.stamps],
    }
  }

  public async stamp(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    body: StampRequestBody,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fileId: string,
  ): Promise<StampResponse> {
    const comment: Comment =
      body.dataType === "text"
        ? {
            id: "1",
            dataType: "text",
            author: dummyUsers[0],
            content: body.content,
            postedAt: new Date().toISOString(),
          }
        : {
            id: "1",
            dataType: "audio",
            author: dummyUsers[0],
            content: "/dog.wav",
            title: body.title,
            postedAt: new Date().toISOString(),
          }
    const stamp = {
      id: `${MockFileUseCase.stamps.length + 1}`,
      author: dummyUsers[0],
      comments: [comment],
      position: {
        page: parseInt(body.page),
        x: parseFloat(body.x),
        y: parseFloat(body.y),
      },
    }
    MockFileUseCase.stamps.push(stamp)
    return stamp as unknown as StampResponse
  }

  public async comment(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    body: CommentRequestBody,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fileId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stampId: string,
  ): Promise<CommentResponse> {
    const stamp = MockFileUseCase.stamps.find((stamp) => stamp.id === stampId)
    if (stamp == null) {
      throw new Error()
    }
    if (body.dataType === "text") {
      const comment: Comment = {
        id: `${stamp.comments.length + 1}`,
        author: dummyUsers[0],
        postedAt: new Date().toISOString(),
        ...body,
      }
      stamp.comments.push(comment)
      return await Promise.resolve(comment)
    } else {
      throw new Error("not implemented")
    }
  }
}
