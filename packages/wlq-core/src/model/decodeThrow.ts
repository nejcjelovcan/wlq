import { fold, left } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { Props, TypeC, TypeOf } from "io-ts";
import { PathReporter } from "io-ts/PathReporter";

export class ValidationError extends Error {
  constructor(public messages: (string | undefined)[]) {
    super(messages.find(m => !!m) || "Validation error");
  }
}

export default function decodeThrow<P extends Props>(
  codec: TypeC<P>,
  i: unknown
): { [K in keyof P]: TypeOf<P[K]> } {
  return pipe(
    codec.decode(i),
    fold(
      e => {
        throw new ValidationError(PathReporter.report(left(e)));
      },
      a => a
    )
  );
}
