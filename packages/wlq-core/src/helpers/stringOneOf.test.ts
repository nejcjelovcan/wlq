import stringOneOf from "./stringOneOf";

describe("stringOneOf", () => {
  it("decodes right if supplied with one of the strings", () => {
    const oneOf = stringOneOf(["a", "b", "c"], "test");
    expect(oneOf.decode("a")).toEqual({ _tag: "Right", right: "a" });
  });
  it("decodes with error if supplied with the wrong string", () => {
    const oneOf = stringOneOf(["a", "b", "c"], "test");
    expect(oneOf.decode("d")).toMatchObject({ _tag: "Left" });
  });
  it("encodes to string", () => {
    const oneOf = stringOneOf(["a", "b", "c"], "test");
    expect(oneOf.encode("a")).toBe("a");
  });
});
