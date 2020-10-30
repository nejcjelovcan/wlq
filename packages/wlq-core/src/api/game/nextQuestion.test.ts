import { roomFixture, gameFixture } from "../../model/fixtures";
import { NotFoundStoreError, StateStoreError } from "../../model/IStore";
import { newMemoryStore } from "../../model/MemoryStore";
import nextQuestion from "./nextQuestion";

describe("nextQuestion", () => {
  it("throws NotFoundStoreError if room does not exist", async () => {
    const emitter = {
      publishToRoom: jest.fn(),
      stateMachineStart: jest.fn()
    };
    const store = newMemoryStore();

    await expect(nextQuestion("roomId", store, emitter)).rejects.toThrowError(
      NotFoundStoreError
    );
  });
  it("throws StateStoreError if room is not in state=Game", async () => {
    const emitter = {
      publishToRoom: jest.fn(),
      stateMachineStart: jest.fn()
    };
    const store = newMemoryStore();
    const room = await store.addRoom(roomFixture());

    await expect(
      nextQuestion(room.roomId, store, emitter)
    ).rejects.toThrowError(StateStoreError);
  });
  it("publishes poseQuestion message and calls stateMachineStart", async () => {
    const emitter = {
      publishToRoom: jest.fn(),
      stateMachineStart: jest.fn()
    };
    const store = newMemoryStore();
    const room = await store.addRoom(
      roomFixture({ current: "Game", game: gameFixture() })
    );

    await nextQuestion(room.roomId, store, emitter);

    const calls = emitter.publishToRoom.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][1]).toMatchObject({
      action: "poseQuestion"
    });

    const calls2 = emitter.stateMachineStart.mock.calls;
    expect(calls2.length).toBe(1);
    expect(calls2[0][1].roomId).toBe(room.roomId);
  });
});
