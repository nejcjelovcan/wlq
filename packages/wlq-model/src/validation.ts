export interface ValidationFieldErrorData {
  field: string
  message: string
}

export class ValidationError extends Error implements ValidationFieldErrorData {
  constructor(public field: string, public message: string) {
    super(message)
  }
}

export type Validator<T> = (obj: { [key: string]: any }) => T
