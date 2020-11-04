import * as t from "io-ts";
import decodeOptional from "./decodeOptional";

describe("decodeOptional", () => {
  it("returns undefined when decoding fails", () => {
    const Codec = t.type({ test: t.string });
    expect(decodeOptional(Codec, {})).toEqual(undefined);
  });

  it("returns output when decoding succeeds", () => {
    const Codec = t.type({ test: t.string });
    expect(decodeOptional(Codec, { test: "string" })).toEqual({
      test: "string"
    });
  });
});
