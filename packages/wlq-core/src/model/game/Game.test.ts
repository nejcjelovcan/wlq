import {
  gameStateQuestionFixture,
  gameStateAnswerFixture,
  gameFixture,
  participantPublicFixture
} from "../fixtures";
import {
  hasParticipantAnswered,
  getGamePublic,
  getParticipantsByAnswer
} from "./Game";

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

describe("hasParticipantAnswered", () => {
  it("returns true if pid in answers", () => {
    const gameAnswer = gameStateAnswerFixture({
      answers: [{ pid: "pid", answer: "answer" }]
    });
    expect(hasParticipantAnswered(gameAnswer, "pid")).toBe(true);
    const gameQuestion = gameStateQuestionFixture({
      answers: [{ pid: "pid", answer: "answer" }]
    });
    expect(hasParticipantAnswered(gameQuestion, "pid")).toBe(true);
  });
  it("returns true if pid in answeredParticipants", () => {
    const gameQuestionPublic = {
      ...getGamePublic(
        gameStateQuestionFixture({
          answers: []
        })
      ),
      answeredParticipants: ["pid"]
    };

    expect(hasParticipantAnswered(gameQuestionPublic, "pid")).toBe(true);
  });
  it("returns true if pid not in answeredParticipants", () => {
    const gameQuestionPublic = {
      ...getGamePublic(
        gameStateQuestionFixture({
          answers: []
        })
      ),
      answeredParticipants: []
    };

    expect(hasParticipantAnswered(gameQuestionPublic, "pid")).toBe(false);
  });
  it("returns false if pid not in answers", () => {
    const gameAnswer = gameStateAnswerFixture({
      answers: [{ pid: "pid", answer: "answer" }]
    });
    expect(hasParticipantAnswered(gameAnswer, "pid2")).toBe(false);
    const gameQuestion = gameStateQuestionFixture({
      answers: [{ pid: "pid", answer: "answer" }]
    });
    expect(hasParticipantAnswered(gameQuestion, "pid2")).toBe(false);
  });
  it("return false if Game not in state Answer|Question", () => {
    expect(
      hasParticipantAnswered(gameFixture({ current: "Idle" }), "pid")
    ).toBe(false);
    expect(
      hasParticipantAnswered(gameFixture({ current: "Finished" }), "pid")
    ).toBe(false);
  });
});

describe("getParticipantsByAnswer", () => {
  it("returns empty map if game not in Answer state", () => {
    expect(
      getParticipantsByAnswer(getGamePublic(gameFixture()), [])
    ).toStrictEqual({});
  });
  it("returns map of participants by answer", () => {
    const participant1 = participantPublicFixture({ pid: "pid" });
    const participant2 = participantPublicFixture({ pid: "pid2" });
    const participant3 = participantPublicFixture({ pid: "pid3" });
    expect(
      getParticipantsByAnswer(
        getGamePublic(
          gameStateAnswerFixture({
            answers: [
              { pid: "pid", answer: "Option 1" },
              { pid: "pid2", answer: "Option 2" },
              { pid: "pid3", answer: "Option 1" }
            ]
          })
        ),
        [participant1, participant2, participant3]
      )
    ).toStrictEqual({
      "Option 1": [participant1, participant3],
      "Option 2": [participant2]
    });
  });
});
