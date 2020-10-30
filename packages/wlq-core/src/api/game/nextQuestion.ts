import { IEmitter, IStore } from "../..";
import { getAllCollections, poseQuestion } from "../../data/geography";
import { getPosedQuestionPublic } from "../../model/game/PosedQuestion";
import { PoseQuestionMessage } from "./NextQuestionMessages";

export default async function nextQuestion(
  roomId: string,
  store: Pick<IStore, "getRoom" | "setGameQuestion">,
  emitter: Pick<IEmitter, "stateMachineStart" | "publishToRoom">
) {
  await store.getRoom({ roomId });

  const question = poseQuestion(getAllCollections());
  await store.setGameQuestion({ roomId }, question);
  await emitter.stateMachineStart(process.env.GAME_QUESTION_START!, {
    roomId: roomId,
    time: question.time
  });

  await emitter.publishToRoom<PoseQuestionMessage>(roomId, {
    action: "poseQuestion",
    data: {
      question: getPosedQuestionPublic(question)
    }
  });
}
