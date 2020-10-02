export class RequestError extends Error {}
export class ApiErrorResponse extends Error {
  constructor(public statusCode: number, error: string) {
    super(error)
  }
}

export const apiRequest = async <R = { [key: string]: any }>(
  endpoint: string,
  requestInit: RequestInit,
): Promise<R> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`,
      requestInit,
    )
    let data = await response.json()

    if (response.status >= 400) {
      throw new ApiErrorResponse(
        response.status,
        data.error || 'Response error',
      )
    }

    return data
  } catch (e) {
    throw new RequestError(`Request error: ${e}`)
  }
}

export const apiGet = async <R>(
  endpoint: string,
  token?: string,
): Promise<R> => {
  return apiRequest<R>(endpoint, {
    method: 'GET',
    headers: token ? [['Authorization', `Bearer ${token}`]] : [],
  })
}

export const apiPost = async <R>(
  endpoint: string,
  token: string,
  data: { [key: string]: any },
): Promise<R> => {
  return apiRequest<R>(endpoint, {
    method: 'POST',
    headers: token ? [['Authorization', `Bearer ${token}`]] : [],
    body: JSON.stringify(data),
  })
}

export interface RequestState {
  loading?: boolean
  error?: string
}
