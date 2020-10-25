import * as t from "io-ts";
import { nanoid } from "nanoid";
import { UserDetailsCodec } from "./UserDetails";

const ParticipantKeyProps = {
  connectionId: t.string
};

const ParticipantProps = {
  type: t.literal("Participant"),
  roomId: t.string,
  pid: t.string,
  details: UserDetailsCodec
};
const ParticipantPrivateProps = {
  uid: t.string
};

export const ParticipantKeyCodec = t.type(ParticipantKeyProps);
export type ParticipantKey = t.TypeOf<typeof ParticipantKeyCodec>;

export const ParticipantCodec = t.type({
  ...ParticipantKeyProps,
  ...ParticipantProps,
  ...ParticipantPrivateProps
});
export type Participant = t.TypeOf<typeof ParticipantCodec>;

export const ParticipantPublicCodec = t.type({
  ...ParticipantProps
});
export type ParticipantPublic = t.TypeOf<typeof ParticipantPublicCodec>;

export function newParticipant(
  participant: Pick<Participant, "uid" | "roomId" | "details" | "connectionId">
): Participant {
  return {
    ...participant,
    type: "Participant",
    pid: nanoid()
  };
}

export function getParticipantPublic({
  uid,
  connectionId,
  ...restPublic
}: Participant): ParticipantPublic {
  return restPublic;
}
