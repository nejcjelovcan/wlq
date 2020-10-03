export class RestResponseError extends Error {
  constructor(public statusCode: number, error: string) {
    super(error)
  }
}

export interface RestRequest<
  D extends object = RestResponseData,
  QS extends object = RestResponseData
> {
  queryString?: QS
  data: D
}

export interface RestResponse<D extends object = RestResponseData> {
  statusCode: number
  data: D
}

export type RestResponseData = { [key: string]: any }

export type RestResponseGenerator = (
  ...args: any[]
) => RestResponse | Promise<RestResponse>

export type RestRespondFunction<D> = (
  responseGenerator: RestResponseGenerator,
) => Promise<D>
