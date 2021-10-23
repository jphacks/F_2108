export class HttpError extends Error {
  public readonly name: string = "HttpError"

  constructor(public status: number, public message: string) {
    super(message)
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}
