import { Either, fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";

export default function resolveEither<E, A>(either: Either<E, A>): A {
  return pipe(
    either,
    fold(
      e => {
        throw e;
      },
      a => a
    )
  );
}
