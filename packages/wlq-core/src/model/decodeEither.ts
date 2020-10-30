import { Either, fold, left, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as t from "io-ts";
import { getIoErrors, IoErrors } from "./errors.model";

export default function decodeEither<A, O = A, I = unknown>(
  codec: t.Type<A, O, I>,
  i: I
): Either<IoErrors, A> {
  return pipe(
    codec.decode(i),
    fold(
      e => {
        return left(getIoErrors(e));
      },
      a => right(a)
    )
  );
}
