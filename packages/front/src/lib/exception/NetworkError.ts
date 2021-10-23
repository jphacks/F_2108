export class NetworkError extends Error {
  public readonly name: string = "NetworkError"

  constructor(public message: string) {
    super(message)
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}
