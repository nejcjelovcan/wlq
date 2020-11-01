import { gameStateQuestionFixture, gameStateAnswerFixture } from "../fixtures";
import { getGamePublic } from "./Game";

describe("getGamePublic", () => {
  it("in state=Question does not include answer", () => {
    const gamePublic = getGamePublic(gameStateQuestionFixture());
    if (gamePublic.current !== "Question") throw Error("Unexpected state");
    expect(Object.keys(gamePublic.question)).not.toContain("answer");
    expect(Object.keys(gamePublic)).not.toContain("answer");
  });
  it("in state=Answer does include answer (and all participants answers)", () => {
    const gamePublic = getGamePublic(gameStateAnswerFixture());
    if (gamePublic.current !== "Answer") throw Error("Unexpected state");
    expect(Object.keys(gamePublic)).toContain("answer");
    expect(Object.keys(gamePublic)).toContain("answers");
  });
});
