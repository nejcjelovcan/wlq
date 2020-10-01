export default interface Request<
  D = { [key: string]: any },
  QS extends object = { [key: string]: any }
> {
  queryString: QS
  data: D
}
