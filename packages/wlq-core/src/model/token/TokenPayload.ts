import * as t from "io-ts";

export const TokenPayloadCodec = t.type({
  sub: t.string
});
export type TokenPayload = t.TypeOf<typeof TokenPayloadCodec>;
