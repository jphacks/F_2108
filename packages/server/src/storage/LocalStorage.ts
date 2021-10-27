import { IStorage } from "./IStorage"
import { writeFile } from "fs/promises"

export class LocalStorage implements IStorage {
  async save(
    type: "file" | "audio",
    filename: string,
    content: Buffer,
  ): Promise<{ url: string }> {
    const url = `/${type}/${filename}`
    const path = __dirname + url

    await writeFile(path, content)

    return { url }
  }
}
