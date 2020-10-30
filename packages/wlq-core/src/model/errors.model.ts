import * as t from "io-ts";

export class ValidationError extends Error {}

export type IoErrors = { [key: string]: [string, string] };

export function getIoErrors(errors: t.Errors): IoErrors {
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

export function errorPairsToString(pairs: IoErrors): string {
  return Object.entries(pairs)
    .map(([key, [message, val]]) => `${message} for property '${key}': ${val}`)
    .join("\n");
}

export class IoValidationError extends ValidationError {
  public errors: IoErrors;

  constructor(errors: t.Errors) {
    const pairs = getIoErrors(errors);
    super(errorPairsToString(pairs));

    this.errors = pairs;
  }
}
