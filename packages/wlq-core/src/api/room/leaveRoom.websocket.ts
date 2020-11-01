import { IEmitter, IStore, IWlqRawWebsocketEvent } from "../..";
import * as t from "io-ts";

export default async function leaveRoom(
  event: IWlqRawWebsocketEvent,
  store: Pick<IStore, "getParticipant" | "deleteParticipant">,
  emitter: Pick<IEmitter, "publishToRoom">
) {
  try {
    const participantKey = event;

    const participant = await store.getParticipant(participantKey);

    await store.deleteParticipant({
      ...participantKey,
      roomId: participant.roomId
    });

    await emitter.publishToRoom<ParticipantLeftMessage>(participant.roomId, {
      action: "participantLeft",
      data: { pid: participant.pid }
    });
  } catch (e) {
    console.error("Error in leaveRoom");
    console.log(e);
  }
}

export const ParticipantLeftMessageCodec = t.type({
  action: t.literal("participantLeft"),
  data: t.type({
    pid: t.string
  })
});

export type ParticipantLeftMessage = t.TypeOf<
  typeof ParticipantLeftMessageCodec
>;
