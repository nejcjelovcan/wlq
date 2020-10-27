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
    const [message] = await client.send({ action: "joinRoom", data: {} });
    client.close();
    expect(message).toMatchObject({ action: "error" });
    expect(message.data.error).toMatch("Could not join room: Invalid value");
  });

  it("emits error message if room does not exist", async () => {
    const client = await websocketClient();
    const [message] = await client.send({
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
    const [message] = await client.send({
      action: "joinRoom",
      data: { token: session.token, details: userDetails, roomId }
    });
    client.close();
    expect(message).toMatchObject({
      action: "setParticipants",
      data: { participants: [{ details: { alias: userDetails.alias } }] }
    });
  });

  it("emits participantJoined to other clients when join succeeds", async () => {
    const {
      room: { roomId }
    } = (await session.axios.post("createRoom", { listed: true })).data;

    // TODO we could check in joinRoom core impl. so that the same
    // user cannot connect twice

    const session2 = await createSession();

    const client1 = await websocketClient(3);
    const client2 = await websocketClient(2);

    const promise1 = client1.send({
      action: "joinRoom",
      data: {
        token: session.token,
        details: { ...userDetails, alias: "User1" },
        roomId
      }
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    const promise2 = client2.send({
      action: "joinRoom",
      data: {
        token: session2.token,
        details: { ...userDetails, alias: "User2" },
        roomId
      }
    });

    const messages = await promise1;
    await promise2;

    expect(messages[0]).toMatchObject({
      action: "setParticipants",
      data: { participants: [{ details: { alias: "User1" } }] }
    });
    expect(messages[1]).toMatchObject({
      action: "participantJoined",
      data: { participant: { details: { alias: "User1" } } }
    });
    expect(messages[2]).toMatchObject({
      action: "participantJoined",
      data: { participant: { details: { alias: "User2" } } }
    });
  });
});
