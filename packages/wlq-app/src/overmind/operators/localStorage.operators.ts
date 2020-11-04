import * as e from "fp-ts/Either";
import { map, Operator, pipe, run } from "overmind";

export const getFromLocalStorage: (
  key: string
) => Operator<void, e.Either<Error, string>> = key =>
  map(function getFromLocalStorage({ effects: { localStorage } }) {
    try {
      return e.right(localStorage.getItem(key));
    } catch (error) {
      return e.left(error);
    }
  });

export const writeToLocalStorage: (key: string) => Operator<string> = key =>
  run(function writeToLocalStorage({ effects: { localStorage } }, value) {
    return localStorage.setItem(key, value);
  });

export const getJsonFromLocalStorage: (
  key: string
) => Operator<void, e.Either<Error, { [key: string]: unknown }>> = key =>
  map(function getJsonFromLocalStorage({ effects: { localStorage } }) {
    try {
      return e.right(JSON.parse(localStorage.getItem(key)));
    } catch (error) {
      return e.left(error);
    }
  });

export const writeJsonToLocalStorage: <T extends { [key: string]: unknown }>(
  key: string
) => Operator<T, string> = function writeJsonToLocalStorage(key) {
  return pipe(
    map((_, value) => JSON.stringify(value)),
    writeToLocalStorage(key)
  );
};
