import { decodeThrow, IEmitter, IStore } from "../..";
import { getAllCollections, poseQuestion } from "../../data/geography";
import { RoomKeyCodec } from "../../model";
import { getPosedQuestionPublic } from "../../model/game/PosedQuestion";
import { StateStoreError } from "../../model/IStore";
import {
  GameFinishedMessage,
  PoseQuestionMessage
} from "./NextQuestionMessages";

export default async function nextQuestion(
  roomKey: { [key: string]: unknown },
  store: Pick<IStore, "getRoom" | "setGameQuestion" | "setGameToFinishedState">,
  emitter: Pick<IEmitter, "stateMachineStart" | "publishToRoom">
) {
  const { roomId } = decodeThrow(RoomKeyCodec, roomKey);
  const room = await store.getRoom({ roomId });

  if (room.current !== "Game") throw new StateStoreError("Invalid State");
  if (room.game.questionIndex < room.game.questionCount) {
    const question = poseQuestion(getAllCollections());

    await store.setGameQuestion({ roomId }, room.game, question);
    await emitter.stateMachineStart(process.env.GAME_QUESTION_TIMEOUT_ARN!, {
      roomId: roomId,
      time: question.time
    });

    await emitter.publishToRoom<PoseQuestionMessage>(roomId, {
      action: "poseQuestion",
      data: {
        question: getPosedQuestionPublic(question)
      }
    });
  } else {
    await store.setGameToFinishedState({ roomId }, room.game);

    await emitter.publishToRoom<GameFinishedMessage>(roomId, {
      action: "gameFinished",
      data: {}
    });
  }
}
