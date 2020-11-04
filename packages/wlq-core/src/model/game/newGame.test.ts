import newGame from "./newGame";

describe("newGame", () => {
  it("returns new game with Idle state", () => {
    expect(newGame()).toMatchObject({ current: "Idle" });
  });
});
