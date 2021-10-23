export class ArgumentError extends Error {
  public readonly name: string = "ArgumentError"

  constructor(public message: string) {
    super(message)
    Object.setPrototypeOf(this, ArgumentError.prototype)
  }
}
