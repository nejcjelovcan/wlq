import { userDetailsFixture } from "@wlq/wlq-core/src/model/fixtures";
import {
  createSession,
  Session,
  websocketClient
} from "../../__integration__/utils";

describe("socketConnection", () => {
  let session: Session;
  beforeAll(async () => {
    session = await createSession();
  });

  it("emits participantLeft to other clients when participant closes connection", async () => {
    const {
      room: { roomId }
    } = (await session.axios.post("createRoom", { listed: true })).data;

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
    const [message] = await client1.receive(
      "participantLeft",
      "setParticipants",
      "participantJoined",
      "participantJoined"
    );
    client1.close();

    expect(message).toMatchObject({
      action: "participantLeft",
      data: { pid }
    });

    expect(client1.queue).toStrictEqual([]);
    expect(client2.queue).toStrictEqual([]);
  });
});
