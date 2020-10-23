import IStore, { StoreError } from "../../model/IStore";
import { newMemoryStore } from "../../model/MemoryStore";
import createRoom from "./createRoom.rest";

describe("createRoom.rest", () => {
  it("responds with statusCode=400 if no listed parameter provided", async () => {
    const emitter = {
      restResponse: jest.fn()
    };
    const store = newMemoryStore();

    await createRoom({ payload: {} }, store, emitter);

    const calls = emitter.restResponse.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toMatchObject({ statusCode: 400 });

    const payload = calls[0][0].payload;
    expect(payload.error).toMatch("Invalid value");
    expect(payload.error).toMatch("listed");
  });

  it("responds statusCode=200 and room data if listed parameter was provided", async () => {
    const emitter = {
      restResponse: jest.fn()
    };
    const store = newMemoryStore();

    await createRoom({ payload: { listed: true } }, store, emitter);

    const calls = emitter.restResponse.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toMatchObject({ statusCode: 200 });

    const payload = calls[0][0].payload;
    expect(payload).toMatchObject({
      room: { type: "Room", listed: true, state: "Idle", participantCount: 0 }
    });
  });

  it("responds with error response if store fails", async () => {
    const emitter = {
      restResponse: jest.fn()
    };
    const store: IStore = {
      ...newMemoryStore(),
      addRoom() {
        throw new StoreError("Error happened");
      }
    };

    await createRoom({ payload: { listed: true } }, store, emitter);

    const calls = emitter.restResponse.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toMatchObject({ statusCode: 500 });

    const payload = calls[0][0].payload;
    expect(payload).toMatchObject({
      error: "Error happened"
    });
  });
});
