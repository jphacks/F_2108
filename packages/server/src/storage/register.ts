import { FastifyInstance } from "fastify"
import { LocalStorage } from "./LocalStorage"
import { S3Storage } from "./S3Storage"
import { IStorage } from "./IStorage"

export const registerStorage = (server: FastifyInstance) => {
  const storage: IStorage =
    process.env.NODE_ENV === "production" ? new S3Storage() : new LocalStorage()

  server.decorate("storage", () => storage)
}
