import { IEmitter } from "../../";
import { newToken } from "../../model/token";
import { GetTokenResponse } from "./GetTokenResponse";

// eslint-disable-next-line require-await
export default async function getToken(
  emitter: Pick<IEmitter, "restResponse">
) {
  emitter.restResponse<GetTokenResponse>({
    statusCode: 200,
    payload: { token: newToken() }
  });
}
