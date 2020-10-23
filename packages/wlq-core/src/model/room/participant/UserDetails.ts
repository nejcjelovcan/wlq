import * as t from "io-ts";
import stringOneOf from "../../helpers/stringOneOf";

export const USER_DETAILS_EMOJIS = [
  "🐵",
  "🐶",
  "🦊",
  "🐱",
  "🦁",
  "🐯",
  "🦄",
  "🐮",
  "🐷",
  "🐭",
  "🐹",
  "🐰",
  "🐻",
  "🐨",
  "🐼",
  "🐦",
  "🐧",
  "🐸",
  "🐠",
  "🐡",
  "🐙"
] as const;

export const USER_DETAILS_COLORS = [
  "yellow",
  "orange",
  "red",
  "pink",
  "purple",
  "blue",
  "teal",
  "green",
  "cyan"
] as const;

export const UserDetailsType = t.type({
  type: t.literal("UserDetails"),
  alias: t.string,
  color: stringOneOf(USER_DETAILS_COLORS, "UserDetailsColor"),
  emoji: stringOneOf(USER_DETAILS_EMOJIS, "UserDetailsEmoji")
});

export type UserDetails = t.TypeOf<typeof UserDetailsType>;
