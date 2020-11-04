// import { newRoom } from "../../model";
import { roomFixture, userDetailsFixture } from "../../model/fixtures";
import { newMemoryStore } from "../../model/MemoryStore";
import { newToken } from "../../model/token";
import joinRoom from "./joinRoom.websocket";
import { JoinRoomMessage } from "./JoinRoomMessages";

const joinRoomEvent = (data: { [key: string]: unknown } = {}) => ({
  connectionId: "connectionId",
  payload: { action: "joinRoom", data }
});

const joinRoomData = (
  override: Partial<JoinRoomMessage["data"]> = {}
): JoinRoomMessage["data"] => ({
  roomId: "test",
  token: newToken(),
  details: userDetailsFixture(),
  ...override
});

describe("joinRoom.websocket", () => {
  it("emits error message to websocket if payload is invalid", async () => {
    const emitter = {
      publishToRoom: jest.fn(),
      websocket: jest.fn()
    };
    const store = newMemoryStore();

    await joinRoom(joinRoomEvent(), store, emitter);

    const calls = emitter.websocket.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe("connectionId");
    expect(calls[0][1]).toMatchObject({ action: "error" });

    const data = calls[0][1].data;
    expect(data.error).toMatch("Could not join room: Invalid value");
  });

  it("emits error message to websocket if room does not exist", async () => {
    const emitter = {
      publishToRoom: jest.fn(),
      websocket: jest.fn()
    };
    const store = newMemoryStore();

    await joinRoom(
      joinRoomEvent(joinRoomData({ roomId: "nonexisting" })),
      store,
      emitter
    );

    const calls = emitter.websocket.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe("connectionId");
    expect(calls[0][1]).toMatchObject({ action: "error" });

    const data = calls[0][1].data;
    expect(data.error).toBe("Could not join room: Room not found");
  });

  it("emits setParticipants to websocket if all went well", async () => {
    const emitter = {
      publishToRoom: jest.fn(),
      websocket: jest.fn()
    };
    const store = newMemoryStore();
    const room = await store.addRoom(roomFixture());

    await joinRoom(
      joinRoomEvent(joinRoomData({ roomId: room.roomId })),
      store,
      emitter
    );

    // setParticipants should be emit to websocket
    const calls = emitter.websocket.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][1]).toMatchObject({ action: "setParticipants" });

    const data = calls[0][1].data;
    expect(data).toMatchObject({ participants: [{ type: "Participant" }] });
  });

  it("publishes participantJoined if all went well", async () => {
    const emitter = {
      publishToRoom: jest.fn(),
      websocket: jest.fn()
    };
    const store = newMemoryStore();
    const room = await store.addRoom(roomFixture());

    await joinRoom(
      joinRoomEvent(joinRoomData({ roomId: room.roomId })),
      store,
      emitter
    );

    // participantJoined should be emit to publish
    const publishCalls = emitter.publishToRoom.mock.calls;
    expect(publishCalls.length).toBe(1);
    expect(publishCalls[0][0]).toBe(room.roomId);
    expect(publishCalls[0][1]).toMatchObject({
      action: "participantJoined",
      data: {
        participant: {
          type: "Participant",
          details: { type: "UserDetails" },
          roomId: room.roomId
        }
      }
    });
  });
});
