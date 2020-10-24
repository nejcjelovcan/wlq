import * as t from "io-ts";
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
  ...ParticipantKeyProps,
  ...ParticipantProps
});
export type ParticipantPublic = t.TypeOf<typeof ParticipantPublicCodec>;
