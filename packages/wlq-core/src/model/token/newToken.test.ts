import newToken from "./newToken";

describe("newToken", () => {
  it("creates new token", () => {
    expect(newToken()).toMatch(/[^.]+\.[^.]+\.[^.]/);
  });
});
