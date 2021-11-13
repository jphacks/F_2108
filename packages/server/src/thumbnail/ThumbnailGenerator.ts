export interface ThumbnailGenerator {
  generate(fileId: string, url: string): void
}
