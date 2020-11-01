import { IEmitter, IStore } from "../..";
import {
  gameFixture,
  gameStateQuestionFixture,
  participantFixture,
  posedQuestionFixture,
  roomFixture
} from "../../model/fixtures";
import { newMemoryStore } from "../../model/MemoryStore";
import answerQuestion from "./answerQuestion.websocket";

describe("answerQuestion.websocket", () => {
  let emitter: Pick<
    IEmitter,
    "publishToRoom" | "stateMachineTaskSuccess" | "websocket"
  >;
  let store: IStore;
  beforeEach(() => {
    emitter = {
      publishToRoom: jest.fn(),
      stateMachineTaskSuccess: jest.fn(),
      websocket: jest.fn()
    };
    store = newMemoryStore();
  });

  it("emits error message to websocket if payload is invalid", async () => {
    const websocket = jest.fn();
    await store.addRoom(roomFixture({ roomId: "roomId" }));
    await store.addParticipant(participantFixture({ roomId: "roomId" }));

    await answerQuestion(
      {
        connectionId: "connectionId",
        payload: { action: "answerQuestion", data: {} }
      },
      store,
      { ...emitter, websocket }
    );

    const calls = websocket.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe("connectionId");
    expect(calls[0][1]).toMatchObject({ action: "error" });

    const data = calls[0][1].data;
    expect(data.error).toMatch("Could not answer question: Invalid value");
  });

  it("emits error message to websocket if room is not in state Game", async () => {
    const websocket = jest.fn();
    await store.addRoom(roomFixture({ roomId: "roomId" }));
    await store.addParticipant(participantFixture({ roomId: "roomId" }));

    await answerQuestion(
      {
        connectionId: "connectionId",
        payload: { action: "answerQuestion", data: { answer: "Answer" } }
      },
      store,
      { ...emitter, websocket }
    );

    const calls = websocket.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe("connectionId");
    expect(calls[0][1]).toMatchObject({ action: "error" });

    const data = calls[0][1].data;
    expect(data.error).toMatch("Could not answer question: Wrong state");
  });

  it("emits error message to websocket if game is not in state Question", async () => {
    const websocket = jest.fn();
    await store.addRoom(
      roomFixture({ roomId: "roomId", current: "Game", game: gameFixture() })
    );
    await store.addParticipant(participantFixture({ roomId: "roomId" }));
    await answerQuestion(
      {
        connectionId: "connectionId",
        payload: { action: "answerQuestion", data: { answer: "Answer" } }
      },
      store,
      { ...emitter, websocket }
    );

    const calls = websocket.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe("connectionId");
    expect(calls[0][1]).toMatchObject({ action: "error" });

    const data = calls[0][1].data;
    expect(data.error).toMatch("Could not answer question: Wrong state");
  });

  it("emits error message to websocket if participant already answered", async () => {
    const websocket = jest.fn();
    await store.addRoom(
      roomFixture({
        roomId: "roomId",
        current: "Game",
        game: gameStateQuestionFixture({
          question: posedQuestionFixture({ options: ["Option 1", "Option 2"] }),
          answers: [{ pid: "pid1", answer: "Option 1" }]
        })
      })
    );
    await store.addParticipant(
      participantFixture({ roomId: "roomId", pid: "pid1" })
    );
    await answerQuestion(
      {
        connectionId: "connectionId",
        payload: { action: "answerQuestion", data: { answer: "Option 1" } }
      },
      store,
      { ...emitter, websocket }
    );

    const calls = websocket.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe("connectionId");
    expect(calls[0][1]).toMatchObject({ action: "error" });

    const data = calls[0][1].data;
    expect(data.error).toMatch("Could not answer question: Already answered");
  });

  it("emits error message to websocket if answer is not one of options", async () => {
    const websocket = jest.fn();
    await store.addRoom(
      roomFixture({
        roomId: "roomId",
        current: "Game",
        game: gameStateQuestionFixture({
          question: posedQuestionFixture({ options: ["Option 1", "Option 2"] }),
          answers: []
        })
      })
    );
    await store.addParticipant(
      participantFixture({ roomId: "roomId", pid: "pid1" })
    );
    await answerQuestion(
      {
        connectionId: "connectionId",
        payload: {
          action: "answerQuestion",
          data: { answer: "Not an option" }
        }
      },
      store,
      { ...emitter, websocket }
    );

    const calls = websocket.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe("connectionId");
    expect(calls[0][1]).toMatchObject({ action: "error" });

    const data = calls[0][1].data;
    expect(data.error).toMatch("Could not answer question: Answer invalid");
  });

  it("publishes userAnswered", async () => {
    const publishToRoom = jest.fn();
    await store.addRoom(
      roomFixture({
        roomId: "roomId",
        current: "Game",
        game: gameStateQuestionFixture({
          question: posedQuestionFixture({ options: ["Option 1", "Option 2"] }),
          answers: []
        })
      })
    );
    await store.addParticipant(
      participantFixture({ roomId: "roomId", pid: "pid1" })
    );
    await answerQuestion(
      {
        connectionId: "connectionId",
        payload: { action: "answerQuestion", data: { answer: "Option 1" } }
      },
      store,
      { ...emitter, publishToRoom }
    );

    const calls = publishToRoom.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe("roomId");
    expect(calls[0][1]).toStrictEqual({
      action: "participantAnswered",
      data: { pid: "pid1" }
    });
  });

  it("calls stateMachineTaskSuccess when and only when all users answer", async () => {
    const stateMachineTaskSuccess = jest.fn();
    await store.addRoom(
      roomFixture({
        roomId: "roomId",
        current: "Game",
        game: gameStateQuestionFixture({
          question: posedQuestionFixture({ options: ["Option 1", "Option 2"] }),
          answers: []
        })
      })
    );
    await store.addParticipant(
      participantFixture({ roomId: "roomId", pid: "pid1" })
    );
    await store.addParticipant(
      participantFixture({
        roomId: "roomId",
        connectionId: "connectionId2",
        pid: "pid2"
      })
    );

    // first user answers
    await answerQuestion(
      {
        connectionId: "connectionId",
        payload: { action: "answerQuestion", data: { answer: "Option 1" } }
      },
      store,
      { ...emitter, stateMachineTaskSuccess }
    );

    // only one user answered out of two so no taskSuccess call
    expect(stateMachineTaskSuccess.mock.calls.length).toBe(0);

    // second user answers
    await answerQuestion(
      {
        connectionId: "connectionId2",
        payload: { action: "answerQuestion", data: { answer: "Option 2" } }
      },
      store,
      { ...emitter, stateMachineTaskSuccess }
    );

    expect(stateMachineTaskSuccess.mock.calls.length).toBe(1);
    expect(stateMachineTaskSuccess.mock.calls[0]).toEqual([
      "questionToken",
      {}
    ]);
  });
});
