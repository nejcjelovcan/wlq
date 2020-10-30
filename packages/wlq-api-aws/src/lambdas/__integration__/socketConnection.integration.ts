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

    const client1 = await websocketClient(4);
    const client2 = await websocketClient(2);

    const userDetails1 = userDetailsFixture({ alias: "User1" });
    const promise1 = client1.send({
      action: "joinRoom",
      data: {
        token: session.token,
        details: userDetails1,
        roomId
      }
    });

    const userDetails2 = userDetailsFixture({ alias: "User2" });
    const promise2 = client2.send({
      action: "joinRoom",
      data: {
        token: session2.token,
        details: userDetails2,
        roomId
      }
    });

    const {
      data: { pid }
    } = (await promise2)[0];

    await new Promise(resolve => setTimeout(resolve, 1000));

    client2.close();
    const messages = await promise1;

    client1.close();

    expect(messages[3]).toMatchObject({
      action: "participantLeft",
      data: { pid }
    });
  });
});
