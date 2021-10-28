import { FileData } from "@domain/fileData"
import { User } from "@domain/user"

export type FileDataSnapshot = {
  type: string
  file: FileData
  updatedAt: string
  updatedBy?: User
}
