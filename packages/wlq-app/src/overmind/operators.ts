import { decodeThrow } from "@wlq/wlq-core";
import * as t from "io-ts";
import { catchError, map, Operator, pipe, run } from "overmind";
import { LocalStorageError } from "./effects/localStorage";

export const decode: <A, O, I>(
  codec: t.Type<A, O, I>
) => Operator<I, A extends Promise<infer U> ? U : A> = codec =>
  map((_, input) => {
    return decodeThrow(codec, input);
  });

export const getFromLocalStorage: (
  key: string
) => Operator<void, string> = key =>
  map(({ effects: { localStorage } }) => localStorage.getItem(key));

export const writeToLocalStorage: (key: string) => Operator<string> = key =>
  run(({ effects: { localStorage } }, value) =>
    localStorage.setItem(key, value)
  );

export const getJsonFromLocalStorage: <T extends {
  [key: string]: unknown;
}>(
  key: string
) => Operator<void, T> = key =>
  pipe(
    getFromLocalStorage(key),
    map((_, value) => {
      try {
        const data = JSON.parse(value);
        return data;
      } catch (e) {
        throw new LocalStorageError(
          `Could not parse '${key}' from localStorage`
        );
      }
    })
  );

export const writeJsonToLocalStorage: <T extends { [key: string]: unknown }>(
  key: string
) => Operator<T> = key =>
  pipe(
    map((_, value) => JSON.stringify(value)),
    writeToLocalStorage(key)
  );

// TODO do start branching please
export const suppressError: <E extends Error>(
  ErrorClass: new () => E
) => Operator = ErrorClass =>
  catchError((_, error) => {
    if (!(error instanceof ErrorClass)) {
      throw error;
    }
  });
