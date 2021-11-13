import { ref, uploadBytes, getDownloadURL } from "@firebase/storage"
import { storage } from "@lib/firebase"

export interface StorageClientInterface {
  upload: (
    file: Blob,
    fileName: string,
    contentType: "application/pdf" | "audio/wav",
  ) => Promise<string>
}

export class StorageClient implements StorageClientInterface {
  public async upload(
    file: Blob,
    path: string,
    contentType: "application/pdf" | "audio/wav",
  ) {
    const storageRef = ref(storage, path)
    const metadata = {
      contentType,
    }
    await uploadBytes(storageRef, file, metadata)
    const url = await getDownloadURL(storageRef)
    return url
  }
}

export const getStorageClient = (): StorageClientInterface =>
  new StorageClient()
