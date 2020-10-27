import * as t from "io-ts";
import { ParticipantPublicCodec, UserDetailsCodec } from "../../model";

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
    participants: t.array(ParticipantPublicCodec),
    pid: t.string
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
