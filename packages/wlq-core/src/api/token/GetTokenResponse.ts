import * as t from "io-ts";
export const GetTokenResponseCodec = t.type({ token: t.string });
export type GetTokenResponse = t.TypeOf<typeof GetTokenResponseCodec>;
