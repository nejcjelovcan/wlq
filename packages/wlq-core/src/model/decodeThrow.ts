import { fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as t from "io-ts";
import { IoValidationError } from "./errors.model";

export default function decodeThrow<A, O = A, I = unknown>(
  codec: t.Type<A, O, I>,
  i: I
): A {
  return pipe(
    codec.decode(i),
    fold(
      e => {
        throw new IoValidationError(e);
      },
      a => a
    )
  );
}
