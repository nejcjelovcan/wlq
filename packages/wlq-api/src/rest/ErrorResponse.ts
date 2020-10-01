export default class ResponseError extends Error {
  constructor(public statusCode: number, error: string) {
    super(error)
  }
}
