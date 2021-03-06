import { decodeThrow, IEmitter, IStore } from "../..";
import { ParticipantAnswerCodec, RoomKeyCodec } from "../../model";
import * as t from "io-ts";

export default async function revealAnswer(
  event: { [key: string]: unknown },
  store: Pick<IStore, "setGameToAnswerState">,
  emitter: Pick<IEmitter, "stateMachineStart" | "publishToRoom">
) {
  const { roomId } = decodeThrow(RoomKeyCodec, event);

  const room = await store.setGameToAnswerState({ roomId });
  emitter.stateMachineStart(process.env.GAME_ANSWER_WAIT_ARN!, {
    roomId,
    waitTime: process.env.ANSWER_WAIT_TIME
  });

  if (room.current === "Game" && room.game.current === "Answer") {
    await emitter.publishToRoom<RevealAnswerMessage>(roomId, {
      action: "revealAnswer",
      data: {
        answer: room.game.question.answer,
        answers: room.game.answers
      }
    });
  }
}

export const RevealAnswerMessageCodec = t.type({
  action: t.literal("revealAnswer"),
  data: t.type({
    answer: t.string,
    answers: t.array(ParticipantAnswerCodec)
  })
});
export type RevealAnswerMessage = t.TypeOf<typeof RevealAnswerMessageCodec>;
