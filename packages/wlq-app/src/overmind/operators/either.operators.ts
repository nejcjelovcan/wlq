import * as e from "fp-ts/Either";
import { Config, createOperator, Operator } from "overmind";

/**
 * Operator for folding a fp-ts Either
 *
 * Requires {success: Operator<A>, error: Operator<E>}
 * Returns operator that has Either<A, E> as input
 *
 * Usage with e.g. decodeEither:
 * ```
 * const action = pipe(
 *   o.decodeEither(Codec),
 *   o.fold({
 *     success: o.sendSuccess(),
 *     error: o.handleError()
 *   })
 * )
 */
export function fold<A, E>({
  error,
  success
}: {
  error: Operator<E>;
  success: Operator<A>;
}): Operator<e.Either<E, A>> {
  return createOperator<Config>("fold", "", (err, _, value, next) => {
    if (err) next(err, value);
    else {
      if (e.isLeft(value)) {
        next(null, value.left, { path: { name: "error", operator: error } });
      } else {
        next(null, value.right, {
          path: { name: "success", operator: success }
        });
      }
    }
  });
}
