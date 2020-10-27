import { axios, createSession, Session } from "../../../__integration__/utils";

describe("createRoom", () => {
  let session: Session;
  beforeAll(async () => {
    session = await createSession();
  });

  it("POST responds 401 if no authorization header provided", async () => {
    await expect(axios.post("createRoom")).rejects.toMatchObject({
      response: {
        data: { message: "Unauthorized" },
        status: 401
      }
    });
  });

  it("POST responds 400 if no listed parameter provided", async () => {
    await expect(session.axios.post("createRoom", {})).rejects.toMatchObject({
      response: {
        data: { error: /Invalid value/ },
        status: 400
      }
    });
  });

  it("POST responds 200 with room data if parameters provided", async () => {
    const response = await session.axios.post("createRoom", { listed: false });
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      room: { type: "Room", listed: false, participantCount: 0, state: "Idle" }
    });
  });
});
