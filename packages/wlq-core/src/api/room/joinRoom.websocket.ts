import * as t from "io-ts";
import {
  IEmitter,
  IStore,
  IWlqRawWebsocketEvent,
  resolveCodecEither,
  ErrorMessage
} from "../..";
import {
  getParticipantPublic,
  newParticipant,
  ParticipantPublicCodec,
  UserDetailsCodec
} from "../../model";
import { verifyToken } from "../../model/token";
import { getErrorMessage } from "../errors";

export default async function joinRoom(
  event: IWlqRawWebsocketEvent,
  store: Pick<IStore, "getRoom" | "addParticipant" | "getParticipants">,
  emitter: Pick<IEmitter, "websocket" | "publish">
) {
  try {
    // validate message
    const {
      data: { token, roomId, details }
    } = resolveCodecEither(JoinRoomMessageCodec.decode(event.payload));

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

export const JoinRoomMessageCodec = t.type({
  action: t.literal("joinRoom"),
  data: t.type({
    roomId: t.string,
    token: t.string,
    details: UserDetailsCodec
  })
});
export type JoinRoomMessage = t.TypeOf<typeof JoinRoomMessageCodec>;

export const SetParticipantsMessageCodec = t.type({
  action: t.literal("setParticipants"),
  data: t.type({
    participants: t.array(ParticipantPublicCodec)
  })
});
export type SetParticipantsMessage = t.TypeOf<
  typeof SetParticipantsMessageCodec
>;

export const ParticipantJoinedMessageCodec = t.type({
  action: t.literal("participantJoined"),
  data: t.type({
    participant: ParticipantPublicCodec
  })
});
export type ParticipantJoinedMessage = t.TypeOf<
  typeof ParticipantJoinedMessageCodec
>;
