import getIndefiniteArticle from "./getIndefiniteArticle";

describe("getIndefiniteArticle", () => {
  it("returns english indefinite article according to given word", () => {
    expect(getIndefiniteArticle("test")).toBe("a");
    expect(getIndefiniteArticle("award")).toBe("an");
  });
});
