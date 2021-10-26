export interface IStorage {
  save(
    type: "file" | "audio",
    filename: string,
    content: Buffer,
  ): Promise<{
    url: string
  }>
}
