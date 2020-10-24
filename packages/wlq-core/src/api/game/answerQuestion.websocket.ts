import * as t from "io-ts";
import {
  IEmitter,
  IStore,
  IWlqRawWebsocketEvent,
  resolveCodecEither
} from "../..";
import { getQuestionTokenIfEverybodyAnswered } from "../../model/room/Room";

export default async function answerQuestion(
  event: IWlqRawWebsocketEvent,
  store: Pick<IStore, "getParticipantAndRoom" | "addAnswer">,
  emitter: Pick<IEmitter, "websocket" | "publish" | "stateMachineTaskSuccess">
) {
  const participantKey = event;

  try {
    // validate incoming event
    const {
      data: { answer }
    } = resolveCodecEither(AnswerQuestionEventCodec.decode(event.payload));

    // get participant & room
    const [participant, room] = await store.getParticipantAndRoom(
      participantKey
    );

    // check if answerable
    if (room.state !== "Game" || room.game.state !== "Question")
      throw new Error("Can only answer if room is in Question state");

    const answerValid = room.game.question.options.includes(answer);
    if (!answerValid) throw new Error("Answer invalid");

    const alreadyAnswered = room.game.answers.find(
      a => a.pid === participant.pid
    );
    if (alreadyAnswered) throw new Error("Already answered");

    // add answer
    const roomUpdated = await store.addAnswer({
      ...participant,
      answer
    });

    // call task success if everybody answered
    const token = await getQuestionTokenIfEverybodyAnswered(roomUpdated);
    if (token) {
      await emitter.stateMachineTaskSuccess(token, {});
    }

    // notify others

    await emitter.publish<UserAnsweredMessage>(
      {
        action: "userAnswered",
        data: { pid: participant.pid }
      },
      { roomId: participant.roomId }
    );
  } catch (e) {
    console.error("Error in answerQuestion");
    console.log(e);

    await emitter.websocket(participantKey.connectionId, {
      action: "error",
      data: { error: "Error answering question" }
    });
  }
}

export const AnswerQuestionEventCodec = t.type({
  action: t.literal("answerQuestion"),
  data: t.type({
    answer: t.string
  })
});
export type AnswerQuestionEvent = t.TypeOf<typeof AnswerQuestionEventCodec>;

export const UserAnsweredMessageCodec = t.type({
  action: t.literal("userAnswered"),
  data: t.type({
    pid: t.string
  })
});
export type UserAnsweredMessage = t.TypeOf<typeof UserAnsweredMessageCodec>;
