import { participantFixture, roomFixture } from "../../model/fixtures";
import { newMemoryStore } from "../../model/MemoryStore";
import leaveRoom from "./leaveRoom.websocket";

describe("leaveRoom.websocket", () => {
  it("publishes participantLeft message to the room", async () => {
    const emitter = {
      publishToRoom: jest.fn()
    };
    const store = newMemoryStore();
    const room = await store.addRoom(roomFixture());

    await store.addParticipant(
      participantFixture({
        pid: "pid",
        connectionId: "connectionId",
        roomId: room.roomId
      })
    );

    await leaveRoom(
      { connectionId: "connectionId", payload: {} },
      store,
      emitter
    );

    const calls = emitter.publishToRoom.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(room.roomId);
    expect(calls[0][1]).toMatchObject({ action: "participantLeft" });

    const data = calls[0][1].data;
    expect(data).toStrictEqual({ pid: "pid" });
  });
});
