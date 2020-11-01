import {
  gameFixture,
  participantFixture,
  roomFixture,
  gameStateQuestionFixture
} from "../fixtures";
import { getQuestionTokenIfEverybodyAnswered, getRoomPublic } from "./Room";

describe("getRoomPublic", () => {
  it("populates websocket when room.current=Idle", () => {
    const room = roomFixture();
    expect(typeof getRoomPublic(room).websocket).toBe("string");
  });
  it("populates websocket when room.current=Game", () => {
    const room = roomFixture({ current: "Game", game: gameFixture() });
    expect(typeof getRoomPublic(room).websocket).toBe("string");
  });
});

describe("getQuestionTokenIfEverybodyAnswered", () => {
  it("returns undefined if room is not in Game state", () => {
    const room = roomFixture();
    const participants = [participantFixture()];
    expect(getQuestionTokenIfEverybodyAnswered(room, participants)).toBe(
      undefined
    );
  });
  it("returns undefined if not all participants answered", () => {
    const room = roomFixture({
      current: "Game",
      game: gameStateQuestionFixture({
        answers: [{ pid: "pid1", answer: "Option 1" }]
      })
    });
    const participants = [
      participantFixture({ pid: "pid1" }),
      participantFixture({ pid: "pid2" })
    ];
    expect(getQuestionTokenIfEverybodyAnswered(room, participants)).toBe(
      undefined
    );
  });
  it("returns question token if all participants answered", () => {
    const room = roomFixture({
      current: "Game",
      game: gameStateQuestionFixture({
        answers: [
          { pid: "pid1", answer: "Option 1" },
          { pid: "pid2", answer: "Option 2" }
        ]
      })
    });
    const participants = [
      participantFixture({ pid: "pid1" }),
      participantFixture({ pid: "pid2" })
    ];
    expect(getQuestionTokenIfEverybodyAnswered(room, participants)).toBe(
      "questionToken"
    );
  });
});
