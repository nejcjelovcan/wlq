import { isLeft } from "fp-ts/lib/Either";
import * as t from "io-ts";
import { getIoErrorPairs } from "./errors.model";

describe("getIoErrorPairs", () => {
  it("returns io error pairs for given t.Errors", () => {
    const Codec = t.type({ numberProp: t.number, stringProp: t.string });

    const either = Codec.decode({ numberProp: "string" });
    if (!isLeft(either)) throw new Error("Decoder should return left");

    expect(getIoErrorPairs(either.left)).toStrictEqual({
      numberProp: ["Invalid value", "string"],
      stringProp: ["Invalid value", "undefined"]
    });
  });

  it("returns io error pairs for given t.Errors (nested)", () => {
    const Codec = t.type({
      object: t.type({ stringProp: t.string }),
      numberProp: t.number
    });

    const either = Codec.decode({ numberProp: "string", object: {} });
    if (!isLeft(either)) throw new Error("Decoder should return left");

    expect(getIoErrorPairs(either.left)).toStrictEqual({
      numberProp: ["Invalid value", "string"],
      "object.stringProp": ["Invalid value", "undefined"]
    });
  });
});
