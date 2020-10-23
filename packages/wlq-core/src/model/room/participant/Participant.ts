import * as t from "io-ts";
import { UserDetailsType } from "./UserDetails";

const ParticipantKeyProps = {
  connectionId: t.string
};

const ParticipantProps = {
  type: t.literal("Participant"),
  roomId: t.string,
  pid: t.string,
  details: UserDetailsType
};
const ParticipantPrivateProps = {
  uid: t.string
};

export const ParticipantKeyType = t.type(ParticipantKeyProps);
export type ParticipantKey = t.TypeOf<typeof ParticipantKeyType>;

export const ParticipantType = t.type({
  ...ParticipantKeyProps,
  ...ParticipantProps,
  ...ParticipantPrivateProps
});
export type Participant = t.TypeOf<typeof ParticipantType>;

export const ParticipantPublicType = t.type({
  ...ParticipantKeyProps,
  ...ParticipantProps
});
export type ParticipantPublic = t.TypeOf<typeof ParticipantPublicType>;
