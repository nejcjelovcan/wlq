import * as t from "io-ts";
import decodeThrow from "./decodeThrow";

describe("decodeThrow", () => {
  it("throws an error when decoding fails", () => {
    const Codec = t.type({ test: t.string });
    expect(() => decodeThrow(Codec, { test: 1 })).toThrowError("Invalid value");
  });

  it("throws an error when decoding fails (intersection)", () => {
    const Codec = t.intersection([
      t.type({ test: t.string }),
      t.type({ other: t.string })
    ]);

    expect(() => decodeThrow(Codec, { other: "string" })).toThrowError(
      "Invalid value"
    );
  });

  it("returns output if decoding succeeds", () => {
    const Codec = t.union([
      t.type({ stringProperty: t.string }),
      t.intersection([
        t.type({
          numberProperty: t.number
        }),
        t.type({
          booleanProperty: t.boolean
        })
      ])
    ]);

    expect(
      decodeThrow(Codec, { numberProperty: 1, booleanProperty: false })
    ).toStrictEqual({
      numberProperty: 1,
      booleanProperty: false
    });
    expect(decodeThrow(Codec, { stringProperty: "string" })).toStrictEqual({
      stringProperty: "string"
    });
  });
});
