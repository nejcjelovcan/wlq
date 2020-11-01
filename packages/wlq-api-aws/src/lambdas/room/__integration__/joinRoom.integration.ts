import { userDetailsFixture } from "@wlq/wlq-core/src/model/fixtures";
import {
  createSession,
  Session,
  websocketClient
} from "../../../__integration__/utils";

describe("joinRoom", () => {
  let session: Session;
  beforeAll(async () => {
    session = await createSession();
  });

  it("emits error message on invalid payload", async () => {
    const client = await websocketClient();
    client.send({ action: "joinRoom", data: {} });
    const [message] = await client.receive("error");
    client.close();

    expect(message).toMatchObject({ action: "error" });
    expect(message.data.error).toMatch("Could not join room: Invalid value");
    expect(client.queue).toStrictEqual([]);
  });

  it("emits error message if room does not exist", async () => {
    const userDetails = userDetailsFixture();
    const client = await websocketClient();
    client.send({
      action: "joinRoom",
      data: {
        token: session.token,
        details: userDetails,
        roomId: "nonexistent"
      }
    });
    const [message] = await client.receive("error");
    client.close();
    expect(message).toEqual({
      action: "error",
      data: { error: "Could not join room: Room not found" }
    });
    expect(client.queue).toStrictEqual([]);
  });

  it("emits setParticipants when join succeeds", async () => {
    const userDetails = userDetailsFixture({ alias: "Alias" });
    const {
      room: { roomId }
    } = (await session.axios.post("createRoom", { listed: true })).data;

    const client = await websocketClient();
    client.send({
      action: "joinRoom",
      data: { token: session.token, details: userDetails, roomId }
    });
    const [message] = await client.receive(
      "setParticipants",
      "participantJoined"
    );
    client.close();
    expect(message).toMatchObject({
      action: "setParticipants",
      data: { participants: [{ details: { alias: "Alias" } }] }
    });
    expect(client.queue).toStrictEqual([]);
  });

  it("updates participantCount when user joins", async () => {
    const userDetails = userDetailsFixture({ alias: "Alias" });
    const {
      room: { roomId }
    } = (await session.axios.post("createRoom", { listed: true })).data;

    const {
      room: { participantCount }
    } = (await session.axios.post("getRoom", { roomId })).data;
    expect(participantCount).toBe(0);

    const client = await websocketClient();
    client.send({
      action: "joinRoom",
      data: { token: session.token, details: userDetails, roomId }
    });
    client.close();

    const {
      room: { participantCount: count }
    } = (await session.axios.post("getRoom", { roomId })).data;

    expect(count).toBe(1);
  });

  it("emits participantJoined to other clients when join succeeds", async () => {
    const {
      room: { roomId }
    } = (await session.axios.post("createRoom", { listed: true })).data;

    // TODO we could check in joinRoom core impl. so that the same
    // user cannot connect twice

    const session2 = await createSession();

    const client1 = await websocketClient();
    const client2 = await websocketClient();

    const userDetails1 = userDetailsFixture({ alias: "User1" });
    client1.send({
      action: "joinRoom",
      data: {
        token: session.token,
        details: userDetails1,
        roomId
      }
    });

    // need to wait so that user2 participantJoin comes second
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userDetails2 = userDetailsFixture({ alias: "User2" });
    client2.send({
      action: "joinRoom",
      data: {
        token: session2.token,
        details: userDetails2,
        roomId
      }
    });

    const messages = await client1.receive(
      "setParticipants",
      "participantJoined",
      "participantJoined"
    );

    client1.close();
    client2.close();

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
    expect(client1.queue).toStrictEqual([]);
  });
});
