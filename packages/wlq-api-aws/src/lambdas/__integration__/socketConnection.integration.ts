import { userDetailsFixture } from "@wlq/wlq-core/src/model/fixtures";
import {
  createSession,
  Session,
  WebsocketClient,
  websocketClient
} from "../../__integration__/utils";

describe("socketConnection", () => {
  let session: Session;
  let client: WebsocketClient | undefined;
  let client2: WebsocketClient | undefined;
  beforeAll(async () => {
    session = await createSession();
  });
  afterEach(() => {
    if (client) client.close();
    if (client2) client2.close();
  });

  it("emits participantLeft to other clients when participant closes connection", async () => {
    const {
      room: { roomId }
    } = (await session.axios.post("createRoom", { listed: true })).data;

    const session2 = await createSession();

    client = await websocketClient();
    client2 = await websocketClient();

    const userDetails1 = userDetailsFixture({ alias: "User1" });
    client.send({
      action: "joinRoom",
      data: {
        token: session.token,
        details: userDetails1,
        roomId
      }
    });

    const userDetails2 = userDetailsFixture({ alias: "User2" });
    client2.send({
      action: "joinRoom",
      data: {
        token: session2.token,
        details: userDetails2,
        roomId
      }
    });

    const [
      {
        data: { pid }
      }
    ] = await client2.receive(
      "setParticipants",
      "participantJoined",
      "participantJoined"
    );

    client2.close();
    const [message] = await client.receive(
      "participantLeft",
      "setParticipants",
      "participantJoined",
      "participantJoined"
    );

    expect(message).toMatchObject({
      action: "participantLeft",
      data: { pid }
    });

    expect(client.queue).toStrictEqual([]);
    expect(client2.queue).toStrictEqual([]);
  });
});
