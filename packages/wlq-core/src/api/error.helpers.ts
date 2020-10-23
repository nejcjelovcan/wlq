import * as t from "io-ts";
import { ValidationError } from "../helpers/resolveCodecEither";
import {
  ExistsStoreError,
  NotFoundStoreError,
  StateStoreError,
  StoreError
} from "../model/IStore";

export function getErrorMessage(error: Error): string {
  if (error instanceof StoreError) {
    return error.message;
  }
  if (error instanceof ValidationError) {
    return error.message;
  }
  return "Internal error";
}

export function getErrorMessageStatusCode(error: Error): number {
  if (error instanceof NotFoundStoreError) {
    return 404;
  }
  if (error instanceof ExistsStoreError) {
    return 409;
  }
  if (error instanceof StateStoreError) {
    return 412;
  }
  if (error instanceof ValidationError) {
    return 400;
  }
  return 500;
}

export const ErrorResponseCodec = t.type({ error: t.string });
export type ErrorResponse = t.TypeOf<typeof ErrorResponseCodec>;
