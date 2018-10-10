export default class AppError extends Error {
  constructor (arg, userMessage) {
    let message = (arg instanceof Error) ? arg.message : arg
    super(message)

    this.name = this.constructor.name
    this.userMessage = userMessage || 'Some Error Occured'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
