export default interface Response<D extends object = { [key: string]: any }> {
  statusCode: number
  data: D
}
