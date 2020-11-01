import { userDetailsFixture } from "@wlq/wlq-core/lib/model/fixtures";
import {
  createSession,
  Session,
  WebsocketClient,
  websocketClient
} from "../../../__integration__/utils";

describe("startGame", () => {
  let session: Session;
  let client: WebsocketClient | undefined;
  beforeAll(async () => {
    session = await createSession();
  });
  afterEach(() => {
    if (client) client.close();
  });

  it("emits error message if participant does not exist", async () => {
    client = await websocketClient();
    client.send({
      action: "startGame",
      data: {}
    });
    const [message] = await client.receive("error");
    expect(message).toEqual({
      action: "error",
      data: { error: "Could not start game: Participant not found" }
    });
    expect(client.queue.length).toBe(0);
  });

  it("emits poseQuestion", async () => {
    const userDetails = userDetailsFixture({ alias: "Alias" });
    const {
      room: { roomId }
    } = (await session.axios.post("createRoom", { listed: true })).data;

    client = await websocketClient();
    client.send({
      action: "joinRoom",
      data: { token: session.token, details: userDetails, roomId }
    });
    await client.receive("setParticipants", "participantJoined");

    await new Promise(resolve => setTimeout(resolve, 1000));

    client.send({
      action: "startGame",
      data: {}
    });
    const [message] = await client.receive("poseQuestion");
    expect(message).toMatchObject({
      action: "poseQuestion",
      data: { question: { type: "PosedQuestion" } }
    });
    expect(client.queue.length).toBe(0);
  });
});
