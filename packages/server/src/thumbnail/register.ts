import { FastifyInstance } from "fastify"
import { LambdaThumbnailGenerator } from "./lambda"

export const registerThumbnailGenerator = (server: FastifyInstance) => {
  const generator = new LambdaThumbnailGenerator()

  server.decorate("thumbnailGenerator", () => generator)
}
