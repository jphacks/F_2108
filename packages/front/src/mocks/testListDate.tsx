// テスト用に使っているダミーデータとinterface
// TODO:実際に使うのはresponseのモデル(API繋ぎ込み時に対応)
export type fileList = {
  id: string
  name: string
  thumbnail: string
  editUser: string
  editDate: string
}

export const dummyFileList: fileList[] = [
  {
    id: "1",
    name: "エンジニア議事録",
    thumbnail: "/sample-thumbnail.jpeg",
    editUser: "山田",
    editDate: "2021/10/29",
  },
  {
    id: "2",
    name: "エンジニア議事録",
    thumbnail: "/sample-thumbnail.jpeg",
    editUser: "山田",
    editDate: "2021/10/29",
  },
  {
    id: "3",
    name: "エンジニア議事録",
    thumbnail: "/sample-thumbnail.jpeg",
    editUser: "山田",
    editDate: "2021/10/29",
  },
  {
    id: "4",
    name: "エンジニア議事録",
    thumbnail: "/sample-thumbnail.jpeg",
    editUser: "山田",
    editDate: "2021/10/29",
  },
  {
    id: "5",
    name: "エンジニア議事録",
    thumbnail: "/sample-thumbnail.jpeg",
    editUser: "山田",
    editDate: "2021/10/29",
  },
  {
    id: "6",
    name: "エンジニア議事録",
    thumbnail: "/sample-thumbnail.jpeg",
    editUser: "山田",
    editDate: "2021/10/29",
  },
  {
    id: "7",
    name: "エンジニア議事録",
    thumbnail: "/sample-thumbnail.jpeg",
    editUser: "山田",
    editDate: "2021/10/29",
  },
]
