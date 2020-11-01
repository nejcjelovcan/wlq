import setEquals from "./setEquals";

describe("setEquals", () => {
  it("returns false when sets are of different size", () => {
    expect(setEquals(new Set([1, 2]), new Set([1, 2, 3]))).toBe(false);
  });
  it("returns false when items differ", () => {
    expect(setEquals(new Set([1, 2]), new Set([1, 3]))).toBe(false);
  });
  it("returns true when all items are equal", () => {
    expect(setEquals(new Set([1, 2]), new Set([1, 2]))).toBe(true);
    expect(setEquals(new Set([2, 1]), new Set([1, 2]))).toBe(true);
  });
});
