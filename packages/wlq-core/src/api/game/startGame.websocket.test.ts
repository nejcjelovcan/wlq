import { IStore } from "../..";
import { participantFixture, roomFixture } from "../../model/fixtures";
import { newMemoryStore } from "../../model/MemoryStore";
import startGame from "./startGame.websocket";

describe("startGame.websocket", () => {
  it("emits error message to websocket if participant does not exist", async () => {
    const emitter = {
      publishToRoom: jest.fn(),
      stateMachineStart: jest.fn(),
      websocket: jest.fn()
    };
    const store = newMemoryStore();
    await startGame(
      { connectionId: "connectionId", payload: {} },
      store,
      emitter
    );

    const calls = emitter.websocket.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe("connectionId");
    expect(calls[0][1]).toMatchObject({ action: "error" });

    const data = calls[0][1].data;
    expect(data.error).toBe("Could not start game: participant not found");
  });
  it("calls store.startGame and store.setGameQuestion", async () => {
    const emitter = {
      publishToRoom: jest.fn(),
      stateMachineStart: jest.fn(),
      websocket: jest.fn()
    };
    const storeStartGame = jest.fn();
    const setGameQuestion = jest.fn();
    const baseStore = newMemoryStore();
    const store: IStore = {
      ...baseStore,
      startGame: (...args) => {
        storeStartGame(...args);
        return baseStore.startGame(...args);
      },
      setGameQuestion
    };
    await store.addRoom(roomFixture({ roomId: "roomId" }));
    await store.addParticipant(
      participantFixture({ connectionId: "connectionId" })
    );

    await startGame(
      { connectionId: "connectionId", payload: {} },
      store,
      emitter
    );

    expect(storeStartGame.mock.calls.length).toBe(1);
    expect(storeStartGame.mock.calls[0][0]).toStrictEqual({ roomId: "roomId" });

    expect(setGameQuestion.mock.calls.length).toBe(1);
  });
});
