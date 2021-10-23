import Fastify from "fastify"

const server = Fastify()

server.get("/ping", async (req, res) => {
  return { pong: "it worked!" }
})

const start = async () => {
  try {
    const PORT = process.env.PORT || 3000
    await server.listen(PORT, "0.0.0.0")
    console.log(`listening localhost:${PORT}`)
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}
start()
