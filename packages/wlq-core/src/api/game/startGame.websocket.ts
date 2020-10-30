import {
  ErrorMessage,
  getErrorMessage,
  IEmitter,
  IStore,
  IWlqRawWebsocketEvent
} from "../..";
import nextQuestion from "./nextQuestion";

export default async function startGame(
  event: IWlqRawWebsocketEvent,
  store: Pick<
    IStore,
    "getRoom" | "setGameQuestion" | "startGame" | "getParticipant"
  >,
  emitter: Pick<IEmitter, "stateMachineStart" | "publishToRoom" | "websocket">
) {
  try {
    const participant = await store.getParticipant(event);
    await store.startGame(
      { roomId: participant.roomId },
      parseInt(process.env.GAME_QUESTION_COUNT!)
    );

    await nextQuestion(participant.roomId, store, emitter);
  } catch (e) {
    console.error("Error in startGame");
    console.log(e);
    await emitter.websocket<ErrorMessage>(event.connectionId, {
      action: "error",
      data: { error: `Could not start game: ${getErrorMessage(e)}` }
    });
  }
}
