import { axios, createSession, Session } from "../../../__integration__/utils";

describe("getRoom", () => {
  let session: Session;
  beforeAll(async () => {
    session = await createSession();
  });

  it("POST responds 401 if no authorization header provided", async () => {
    await expect(axios.post("getRoom")).rejects.toMatchObject({
      response: {
        data: { message: "Unauthorized" },
        status: 401
      }
    });
  });

  it("POST responds 400 if no roomId parameter provided", async () => {
    await expect(session.axios.post("getRoom", {})).rejects.toMatchObject({
      response: {
        data: {
          error: "Invalid value for property 'roomId': undefined"
        },
        status: 400
      }
    });
  });

  it("POST responds 404 if room does not exist", async () => {
    await expect(
      session.axios.post("getRoom", { roomId: "nonexistent" })
    ).rejects.toMatchObject({
      response: {
        data: { error: "Room not found" },
        status: 404
      }
    });
  });

  it("POST responds 200 with room data if room exists", async () => {
    const {
      room: { roomId }
    } = (await session.axios.post("createRoom", { listed: true })).data;

    const response = await session.axios.post("getRoom", { roomId });
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      room: {
        type: "Room",
        listed: true,
        participantCount: 0,
        current: "Idle"
      }
    });
  });
});
