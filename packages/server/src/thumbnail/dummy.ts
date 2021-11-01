import { ThumbnailGenerator } from "./ThumbnailGenerator"

export class DummyThumbnailGenerator implements ThumbnailGenerator {
  generate(fileId: string, url: string): void {
    throw new Error("This is dummy class. Don't use.")
  }
}
