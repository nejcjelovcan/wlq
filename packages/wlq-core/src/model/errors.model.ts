import * as t from "io-ts";

export class ValidationError extends Error {}

export type IoErrorPairs = { [key: string]: [string, string] };

export function getIoErrorPairs(errors: t.Errors): IoErrorPairs {
  return Object.fromEntries(
    errors.map(error => [
      error.context
        .map(({ key }) => key)
        .filter(key => key !== "")
        .join("."),
      [error.message || "Invalid value", `${error.value}`]
    ])
  );
}

export function errorPairsToString(pairs: IoErrorPairs): string {
  return Object.entries(pairs)
    .map(([key, [message, val]]) => `${message} for property '${key}': ${val}`)
    .join("\n");
}

export class IoValidationError extends ValidationError {
  public errors: IoErrorPairs;

  constructor(errors: t.Errors) {
    const pairs = getIoErrorPairs(errors);
    super(errorPairsToString(pairs));

    this.errors = pairs;
  }
}
