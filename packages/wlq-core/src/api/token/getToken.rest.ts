import { JWK, JWT } from "jose";
import { nanoid } from "nanoid";
import IEmitter from "../../emitter/IEmitter";

let _key: JWK.Key;
const getKey = () => {
  if (!_key) _key = JWK.asKey(process.env.API_OCT_SECRET_KEY!);
  return _key;
};

export default async function getToken(
  emitter: Pick<IEmitter, "restResponse">
) {
  await emitter.restResponse({
    statusCode: 200,
    payload: { token: JWT.sign({ sub: nanoid() }, getKey()) }
  });
}
