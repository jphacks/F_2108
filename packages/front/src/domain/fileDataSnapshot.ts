import { FileData } from "./fileData"
import { User } from "./user"

export type FileDataSnapshot = {
  type: string
  file: FileData
  updatedAt: string
  updatedBy?: User
}
