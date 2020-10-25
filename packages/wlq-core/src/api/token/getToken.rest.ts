import * as t from "io-ts";
import { IEmitter } from "../../";
import { newToken } from "../../model/token";

// eslint-disable-next-line require-await
export default async function getToken(
  emitter: Pick<IEmitter, "restResponse">
) {
  emitter.restResponse({
    statusCode: 200,
    payload: { token: newToken() }
  });
}

export const GetTokenResponseCodec = t.type({ token: t.string });
export type GetTokenResponse = t.TypeOf<typeof GetTokenResponseCodec>;
