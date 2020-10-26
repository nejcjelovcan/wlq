import { fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { Props, TypeC, TypeOf } from "io-ts";

export default function decodeOptional<P extends Props>(
  codec: TypeC<P>,
  i: unknown
): { [K in keyof P]: TypeOf<P[K]> } | undefined {
  return pipe(
    codec.decode(i),
    fold(
      _ => undefined,
      a => a
    )
  );
}
