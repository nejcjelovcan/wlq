import * as t from "io-ts";
import { decodeThrow, IEmitter, IStore, IWlqRawWebsocketEvent } from "../..";
import { StateStoreError } from "../../model/IStore";
import { getQuestionTokenIfEverybodyAnswered } from "../../model/room/Room";
import { ErrorMessage, getErrorMessage } from "../api.errors";

export default async function answerQuestion(
  event: IWlqRawWebsocketEvent,
  store: Pick<
    IStore,
    "getParticipant" | "getRoom" | "getParticipants" | "addAnswer"
  >,
  emitter: Pick<
    IEmitter,
    "websocket" | "publishToRoom" | "stateMachineTaskSuccess"
  >
) {
  const participantKey = event;

  try {
    // validate incoming event
    const {
      data: { answer }
    } = decodeThrow(AnswerQuestionEventCodec, event.payload);

    // get participant & room
    const participant = await store.getParticipant(participantKey);
    const room = await store.getRoom({ roomId: participant.roomId });

    // check if answerable
    if (room.current !== "Game" || room.game.current !== "Question")
      throw new StateStoreError("Wrong state");

    const answerValid = room.game.question.options.includes(answer);
    if (!answerValid) throw new StateStoreError("Answer invalid");

    const alreadyAnswered = room.game.answers.find(
      a => a.pid === participant.pid
    );
    if (alreadyAnswered) throw new StateStoreError("Already answered");

    // add answer
    const roomUpdated = await store.addAnswer(participant, answer);

    // get all participants
    const participants = await store.getParticipants({
      roomId: participant.roomId
    });

    // call task success if everybody answered
    const token = getQuestionTokenIfEverybodyAnswered(
      roomUpdated,
      participants
    );
    if (token) {
      await emitter.stateMachineTaskSuccess(token, {});
    }

    // notify others
    await emitter.publishToRoom<ParticipantAnsweredMessage>(room.roomId, {
      action: "participantAnswered",
      data: { pid: participant.pid }
    });
  } catch (e) {
    console.error("Error in answerQuestion");
    console.log(e);
    await emitter.websocket<ErrorMessage>(event.connectionId, {
      action: "error",
      data: { error: `Could not answer question: ${getErrorMessage(e)}` }
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

export const ParticipantAnsweredMessageCodec = t.type({
  action: t.literal("participantAnswered"),
  data: t.type({
    pid: t.string
  })
});
export type ParticipantAnsweredMessage = t.TypeOf<
  typeof ParticipantAnsweredMessageCodec
>;
