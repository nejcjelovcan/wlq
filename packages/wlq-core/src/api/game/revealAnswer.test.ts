import { getAllCollections, poseQuestion } from "../../data/geography";
import { roomFixture } from "../../model/fixtures";
import { NotFoundStoreError, StateStoreError } from "../../model/IStore";
import { newMemoryStore } from "../../model/MemoryStore";
import { IoValidationError } from "../../model/model.errors";
import revealAnswer from "./revealAnswer";

describe("revealAnswer", () => {
  it("throws IoValidationError if payload is not valid", async () => {
    const emitter = {
      publishToRoom: jest.fn(),
      stateMachineStart: jest.fn()
    };
    const store = newMemoryStore();

    await expect(revealAnswer({}, store, emitter)).rejects.toThrowError(
      IoValidationError
    );
  });
  it("throws NotFoundStoreError if room does not exist", async () => {
    const emitter = {
      publishToRoom: jest.fn(),
      stateMachineStart: jest.fn()
    };
    const store = newMemoryStore();

    await expect(
      revealAnswer(
        { roomId: "roomId", questionToken: "questionToken" },
        store,
        emitter
      )
    ).rejects.toThrowError(NotFoundStoreError);
  });
  it("throws StateStoreError if room is not in state=Question", async () => {
    const emitter = {
      publishToRoom: jest.fn(),
      stateMachineStart: jest.fn()
    };
    const store = newMemoryStore();
    await store.addRoom(roomFixture({ roomId: "roomId" }));

    await expect(
      revealAnswer(
        { roomId: "roomId", questionToken: "questionToken" },
        store,
        emitter
      )
    ).rejects.toThrowError(StateStoreError);
  });
  it("calls stateMachineStart with roomId and waitTime", async () => {
    const emitter = {
      publishToRoom: jest.fn(),
      stateMachineStart: jest.fn()
    };
    const store = newMemoryStore();
    const { roomId } = await store.addRoom(roomFixture({ roomId: "roomId" }));
    const room = await store.startGame({ roomId }, 10);
    if (room.current !== "Game") throw new Error("Unexpected state");
    await store.setGameQuestion(
      { roomId },
      room.game,
      poseQuestion(getAllCollections())
    );

    await revealAnswer({ roomId }, store, emitter);

    const calls = emitter.stateMachineStart.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][1].roomId).toBe("roomId");
    expect(typeof calls[0][1].waitTime).toBe("string");
  });
  it("publishes revealAnswer", async () => {
    const emitter = {
      publishToRoom: jest.fn(),
      stateMachineStart: jest.fn()
    };
    const store = newMemoryStore();
    const { roomId } = await store.addRoom(roomFixture({ roomId: "roomId" }));
    const room = await store.startGame({ roomId }, 10);
    if (room.current !== "Game") throw new Error("Unexpected state");
    await store.setGameQuestion(
      { roomId },
      room.game,
      poseQuestion(getAllCollections())
    );

    await revealAnswer({ roomId }, store, emitter);

    const calls = emitter.publishToRoom.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe("roomId");
    expect(calls[0][1]).toMatchObject({ action: "revealAnswer", data: {} });
  });
});
