import { decodeEither, IoErrors } from "@wlq/wlq-core";
import * as e from "fp-ts/Either";
import * as t from "io-ts";
import { map, Operator } from "overmind";

/**
 * Operator for decoding input with a provided Codec
 *
 * Returns a fp-ts Either (to be e.g. folded with fold operator)
 *
 * Note: Using IOperator with IConfiguration here, since the operator
 * never uses the context and is therefore Config-agnostic
 */
export const decode: <A, O, I>(
  codec: t.Type<A, O, I>
) => Operator<
  I,
  e.Either<IoErrors, A> extends Promise<infer U> ? U : e.Either<IoErrors, A>
> = codec =>
  map(function decode(_, input) {
    return decodeEither(codec, input);
  });
