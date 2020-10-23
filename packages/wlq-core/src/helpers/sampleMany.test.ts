import sampleMany from "./sampleMany";

describe("sampleMany", () => {
  it("returns the amount of items passed as count argument", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(sampleMany(arr, 1).length).toBe(1);
    expect(sampleMany(arr, 3).length).toBe(3);
  });
  it("throws an error if count exceeds array length", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(() => sampleMany(arr, 10)).toThrowError("Invalid array size");
  });
});
