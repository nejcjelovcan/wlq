import * as t from "io-ts";
import { resolveEither } from "../../helpers";
import { getQuestionTokenIfEverybodyAnswered } from "../../model/room/Room";
import IWlqContext from "../IWlqContext";
import { IWlqRawWebsocketEvent } from "../IWlqRawEvent";

export default async function answerQuestion(
  event: IWlqRawWebsocketEvent,
  context: IWlqContext
) {
  let participantKey = event;

  try {
    // validate incoming event
    const {
      payload: { answer }
    } = resolveEither(AnswerQuestionEventCodec.decode(event.payload));

    // get participant & room
    const [participant, room] = await context.store.getParticipantAndRoom(
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
    const roomUpdated = await context.store.addAnswer({
      ...participant,
      answer
    });

    // call task success if everybody answered
    const token = await getQuestionTokenIfEverybodyAnswered(roomUpdated);
    if (token) {
      await context.emitter.stateMachineTaskSuccess(token, {});
    }

    // notify others

    await context.emitter.publish<UserAnsweredMessage>(
      {
        action: "userAnswered",
        payload: { pid: participant.pid }
      },
      { roomId: participant.roomId }
    );
  } catch (e) {
    console.error("Error in answerQuestion");
    console.log(e);

    await context.emitter.websocket(participantKey.connectionId, {
      action: "error",
      payload: { error: "Error answering question" }
    });
  }
}

export const AnswerQuestionEventCodec = t.type({
  action: t.literal("answerQuestion"),
  payload: t.type({
    answer: t.string
  })
});
export type AnswerQuestionEvent = t.TypeOf<typeof AnswerQuestionEventCodec>;

export const UserAnsweredMessageCodec = t.type({
  action: t.literal("userAnswered"),
  payload: t.type({
    pid: t.string
  })
});
export type UserAnsweredMessage = t.TypeOf<typeof UserAnsweredMessageCodec>;
