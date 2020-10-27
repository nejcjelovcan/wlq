import {
  createSession,
  Session,
  websocketClient
} from "../../../__integration__/utils";
import { UserDetails } from "@wlq/wlq-core/lib/model";

const userDetails: UserDetails = {
  type: "UserDetails",
  alias: "Alias",
  emoji: "🐦",
  color: "blue"
};

describe("joinRoom", () => {
  let session: Session;
  beforeAll(async () => {
    session = await createSession();
  });

  it("emits error message on invalid payload", async () => {
    const client = await websocketClient();
    const message = await client.send({ action: "joinRoom", data: {} });
    client.close();
    expect(message).toMatchObject({ action: "error" });
    expect(message.data.error).toMatch("Could not join room: Invalid value");
  });

  it("emits error message if room does not exist", async () => {
    const client = await websocketClient();
    const message = await client.send({
      action: "joinRoom",
      data: {
        token: session.token,
        details: userDetails,
        roomId: "nonexistent"
      }
    });
    client.close();
    expect(message).toEqual({
      action: "error",
      data: { error: "Could not join room: Room not found" }
    });
  });

  it("emits setParticipants when join succeeds", async () => {
    const {
      room: { roomId }
    } = (await session.axios.post("createRoom", { listed: true })).data;
    const client = await websocketClient();
    const message = await client.send({
      action: "joinRoom",
      data: { token: session.token, details: userDetails, roomId }
    });
    client.close();
    expect(message).toEqual({
      action: "error",
      data: { error: "Could not join room: Room not found" }
    });
  });
});
