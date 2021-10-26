export type ResponseBody = {
  result: "success" | "error"
  data: Record<string, unknown> | Record<string, unknown>[]
}
