import { Either, fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { left } from "fp-ts/lib/Either";
import { Errors } from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { ValidationError } from "./decodeThrow";

export default function resolveEither<E extends Errors, A>(
  either: Either<E, A>
): A {
  return pipe(
    either,
    fold(
      e => {
        throw new ValidationError(PathReporter.report(left(e)));
      },
      a => a
    )
  );
}
