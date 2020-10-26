import {
  ErrorMessage,
  IEmitter,
  IStore,
  IWlqRawWebsocketEvent,
  decodeThrow
} from "../..";
import { getParticipantPublic, newParticipant } from "../../model";
import { verifyToken } from "../../model/token";
import { getErrorMessage } from "../errors";
import {
  JoinRoomMessageCodec,
  ParticipantJoinedMessage,
  SetParticipantsMessage
} from "./JoinRoomMessages";

export default async function joinRoom(
  event: IWlqRawWebsocketEvent,
  store: Pick<IStore, "getRoom" | "addParticipant" | "getParticipants">,
  emitter: Pick<IEmitter, "websocket" | "publish">
) {
  try {
    // validate message
    const {
      data: { token, roomId, details }
    } = decodeThrow(JoinRoomMessageCodec, event.payload);

    // verify token
    const uid = await verifyToken(token);

    // get room to check if it exists
    await store.getRoom({ roomId });

    // create participant
    const participant = newParticipant({
      uid,
      details,
      roomId,
      connectionId: event.connectionId
    });

    await store.addParticipant(participant);

    // send setParticipants event to joining user
    const participants = await store.getParticipants({ roomId });
    await emitter.websocket<SetParticipantsMessage>(event.connectionId, {
      action: "setParticipants",
      data: {
        participants: participants
          .filter(p => p.pid !== participant.pid)
          .map(getParticipantPublic)
      }
    });

    // send participantJoined to other users
    await emitter.publish<ParticipantJoinedMessage>({
      action: "participantJoined",
      data: { participant: getParticipantPublic(participant) }
    });
  } catch (e) {
    console.error("Error in joinRoom");
    console.log(e);
    await emitter.websocket<ErrorMessage>(event.connectionId, {
      action: "error",
      data: { error: `Could not join room: ${getErrorMessage(e)}` }
    });
  }
}
