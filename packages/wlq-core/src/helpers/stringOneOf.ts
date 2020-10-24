import * as t from "io-ts";

const stringOneOf = <T extends Readonly<string[]>>(
  states: T,
  enumName: string
) => {
  Object.freeze(states);
  const is = (u: unknown): u is typeof states[number] =>
    typeof u === "string" && states.includes(u);
  return new t.Type<typeof states[number], string>(
    enumName,
    is,
    (u, c) => (is(u) ? t.success(u as typeof states[number]) : t.failure(u, c)),
    a => (a as unknown) as string
  );
};
export default stringOneOf;
