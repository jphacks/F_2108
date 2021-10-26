import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRegisterOptions,
  FastifySchema,
} from "fastify"
import { File } from "../entity/File"
import { connection } from "../index"
import { RouteShorthandOptions } from "fastify/types/route"

const routeOption = ({
  body,
  querystring,
  headers,
}: Partial<{
  body: Record<string, unknown>
  querystring: Record<string, unknown>
  headers: Record<string, unknown>
}>): RouteShorthandOptions => {
  const schema: FastifySchema = {
    response: {
      200: {
        type: "object",
        properties: {
          result: { type: "string" },
          data: { type: "object" },
        },
      },
    },
  }

  if (body) schema.body = body
  if (querystring) schema.querystring = querystring
  if (headers) schema.headers = headers

  return { schema }
}

const response = (data: Record<string, unknown>) => ({
  result: "success",
  data,
})

export const fileHandler = async (server: FastifyInstance) => {
  server.get("/file", routeOption({}), async () => {
    const file = new File()
    file.name = "sample document"

    const repository = connection.getRepository(File)
    const files = await repository.find()

    return response({
      files: files.map((f) => ({
        id: f.id,
        name: f.name,
      })),
    })
  })

  server.post("/file", async () => {
    const file = new File()
    file.name = "awesome file"

    const repository = connection.getRepository(File)
    const created = await repository.save(file)

    return response({
      file: {
        id: created.id,
        name: created.name,
      },
    })
  })
}
