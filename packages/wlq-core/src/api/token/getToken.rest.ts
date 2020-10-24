import { JWT } from "jose";
import { nanoid } from "nanoid";
import { IEmitter } from "../../";
import { getOctKey, TokenPayload } from "../../model/token";

// eslint-disable-next-line require-await
export default async function getToken(
  emitter: Pick<IEmitter, "restResponse">
) {
  const payload: TokenPayload = { sub: nanoid() };
  emitter.restResponse({
    statusCode: 200,
    payload: { token: JWT.sign(payload, getOctKey()) }
  });
}
