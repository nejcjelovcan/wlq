// import { decodeThrow } from "@wlq/wlq-core";
import { PoseQuestionMessageCodec } from "@wlq//wlq-core/lib/api/game/NextQuestionMessages";
import { decodeThrow } from "@wlq/wlq-core/lib";
import { userDetailsFixture } from "@wlq/wlq-core/lib/model/fixtures";
import {
  createSession,
  Session,
  wait,
  WebsocketClient,
  websocketClient
} from "../../../__integration__/utils";

describe("answerQuestion", () => {
  let session: Session;
  let client: WebsocketClient | undefined;
  let client2: WebsocketClient | undefined;
  beforeAll(async () => {
    session = await createSession();
  });
  afterEach(async () => {
    if (client) client.close();
    if (client2) client2.close();
    // TODO I think there are some throttling issues with ApiGateway for websocket
    await wait(5000)();
  });

  it("emits error message if participant does not exist", async done => {
    client = await websocketClient();
    client.send({
      action: "answerQuestion",
      data: { answer: "Test" }
    });
    const [message] = await client.receive("error");
    expect(message).toEqual({
      action: "error",
      data: { error: "Could not answer question: Participant not found" }
    });
    expect(client.queue.length).toBe(0);
    done();
  });

  it("emits error message if room not in Game state", async done => {
    client = await websocketClient();
    const {
      room: { roomId }
    } = (await session.axios.post("createRoom", { listed: true })).data;
    client.send({
      action: "joinRoom",
      data: { token: session.token, details: userDetailsFixture(), roomId }
    });
    await client.receive("setParticipants", "participantJoined");
    client.send({
      action: "answerQuestion",
      data: { answer: "Test" }
    });
    const [message] = await client.receive("error");
    expect(message).toEqual({
      action: "error",
      data: { error: "Could not answer question: Wrong state" }
    });
    expect(client.queue.length).toBe(0);
    done();
  });

  it("emits error message if answer not among options", async done => {
    client = await websocketClient();
    const {
      room: { roomId }
    } = (await session.axios.post("createRoom", { listed: true })).data;
    client.send({
      action: "joinRoom",
      data: { token: session.token, details: userDetailsFixture(), roomId }
    });
    await client.receive("setParticipants", "participantJoined");

    client.send({ action: "startGame", data: {} });
    await client.receive("poseQuestion");

    client.send({
      action: "answerQuestion",
      data: { answer: "Not an option" }
    });
    const [message] = await client.receive("error");

    expect(message).toEqual({
      action: "error",
      data: { error: "Could not answer question: Answer invalid" }
    });
    expect(client.queue.length).toBe(0);
    done();
  });

  it("emits error message if participant already answered", async done => {
    // we need two participants for this test, lest the answerQuestion triggers
    // revealAnswer and we get Wrong state error message

    client = await websocketClient();
    const {
      room: { roomId }
    } = (await session.axios.post("createRoom", { listed: true })).data;
    client.send({
      action: "joinRoom",
      data: { token: session.token, details: userDetailsFixture(), roomId }
    });
    await client.receive("setParticipants", "participantJoined");

    client2 = await websocketClient();
    client2.send({
      action: "joinRoom",
      data: { token: session.token, details: userDetailsFixture(), roomId }
    });

    client.send({ action: "startGame", data: {} });
    const [poseMessage] = await client.receive(
      "poseQuestion",
      "participantJoined"
    );
    const questionMessage = decodeThrow(PoseQuestionMessageCodec, poseMessage);

    client.send({
      action: "answerQuestion",
      data: { answer: questionMessage.data.question.options[0] }
    });
    await client.receive("participantAnswered");

    client.send({
      action: "answerQuestion",
      data: { answer: questionMessage.data.question.options[1] }
    });

    const [message] = await client.receive("error");
    expect(message).toEqual({
      action: "error",
      data: { error: "Could not answer question: Already answered" }
    });
    expect(client.queue.length).toBe(0);
    done();
  });

  it("emits participantAnswered and revealAnswer", async done => {
    const userDetails = userDetailsFixture({ alias: "Alias" });
    const {
      room: { roomId }
    } = (await session.axios.post("createRoom", { listed: true })).data;

    client = await websocketClient();
    client.send({
      action: "joinRoom",
      data: { token: session.token, details: userDetails, roomId }
    });
    const [
      {
        data: { pid }
      }
    ] = await client.receive("setParticipants", "participantJoined");

    client.send({ action: "startGame", data: {} });
    const [poseMessage] = await client.receive("poseQuestion");
    const questionMessage = decodeThrow(PoseQuestionMessageCodec, poseMessage);

    client.send({
      action: "answerQuestion",
      data: {
        answer: questionMessage.data.question.options[0]
      }
    });
    const [answered, reveal] = await client.receive(
      "participantAnswered",
      "revealAnswer"
    );

    expect(answered).toMatchObject({
      action: "participantAnswered",
      data: { pid }
    });
    expect(reveal).toMatchObject({
      action: "revealAnswer",
      data: {
        answers: [{ answer: questionMessage.data.question.options[0], pid }]
      }
    });
    expect(client.queue.length).toBe(0);
    done();
  });
});
