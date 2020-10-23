import { JWT } from "jose";
import { nanoid } from "nanoid";
import IEmitter from "../../emitter/IEmitter";
import getKey from "./getKey";
import { TokenPayload } from "./TokenPayload";

// eslint-disable-next-line require-await
export default async function getToken(
  emitter: Pick<IEmitter, "restResponse">
) {
  const payload: TokenPayload = { sub: nanoid() };
  emitter.restResponse({
    statusCode: 200,
    payload: { token: JWT.sign(payload, getKey()) }
  });
}
