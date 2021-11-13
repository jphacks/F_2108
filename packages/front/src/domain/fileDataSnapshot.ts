import { FileData } from "@domain/fileData"
import { User } from "@domain/user"

export type FileDataSnapshot = {
  type: "own" | "shared"
  file: FileData
  updatedAt: string
  updatedBy?: User
}
