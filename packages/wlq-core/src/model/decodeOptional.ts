import { fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as t from "io-ts";

export default function decodeOptional<A, O = A, I = unknown>(
  codec: t.Type<A, O, I>,
  i: I
): A | undefined {
  return pipe(
    codec.decode(i),
    fold(
      () => undefined,
      a => a
    )
  );
}
