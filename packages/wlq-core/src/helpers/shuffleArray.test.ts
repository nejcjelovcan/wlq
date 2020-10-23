import shuffleArray from "./shuffleArray";

describe("shuffleArray", () => {
  it("return array of the same items different order", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(new Set(arr)).toEqual(new Set(shuffleArray(arr)));
  });
});
