import { FastifyInstance } from "fastify"
import { LambdaThumbnailGenerator } from "./lambda"
import { DummyThumbnailGenerator } from "./dummy"

export const registerThumbnailGenerator = (server: FastifyInstance) => {
  const generator =
    process.env.NODE_ENV === "production"
      ? new LambdaThumbnailGenerator()
      : new DummyThumbnailGenerator()

  server.decorate("thumbnailGenerator", () => generator)
}
