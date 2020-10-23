import newGame from "./newGame";

describe("newGame", () => {
  it("returns new game with given roomId", () => {
    expect(newGame({ roomId: "roomId" })).toMatchObject({ roomId: "roomId" });
  });
  it("returns new game with Idle state", () => {
    expect(newGame({ roomId: "roomId" })).toMatchObject({ state: "Idle" });
  });
});
