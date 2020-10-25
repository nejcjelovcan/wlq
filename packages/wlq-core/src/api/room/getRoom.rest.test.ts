import { newMemoryStore } from "../../model/MemoryStore";
import newRoom from "../../model/room/newRoom";
import getRoom from "./getRoom.rest";

describe("createRoom.rest", () => {
  it("responds with statusCode=400 if no roomId provided", async () => {
    const emitter = {
      restResponse: jest.fn()
    };
    const store = newMemoryStore();

    await getRoom({ payload: {} }, store, emitter);

    const calls = emitter.restResponse.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toMatchObject({ statusCode: 400 });

    const payload = calls[0][0].payload;
    expect(payload.error).toMatch("Invalid value");
    expect(payload.error).toMatch("roomId");
  });

  it("responds statusCode=200 and room data if room exists", async () => {
    const emitter = {
      restResponse: jest.fn()
    };
    const store = newMemoryStore();
    const room = newRoom({ listed: true });
    store.addRoom(room);

    await getRoom({ payload: { roomId: room.roomId } }, store, emitter);

    const calls = emitter.restResponse.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toMatchObject({ statusCode: 200 });

    const payload = calls[0][0].payload;
    expect(payload).toMatchObject({
      room
    });
  });

  it("responds with 404 if room does not exist", async () => {
    const emitter = {
      restResponse: jest.fn()
    };
    const store = newMemoryStore();

    await getRoom({ payload: { roomId: "testId" } }, store, emitter);

    const calls = emitter.restResponse.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toMatchObject({ statusCode: 404 });

    const payload = calls[0][0].payload;
    expect(payload).toMatchObject({
      error: "Room not found"
    });
  });
});
