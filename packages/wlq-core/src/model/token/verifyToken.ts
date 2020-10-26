import { JWT } from "jose";
import { decodeThrow } from "../../";
import getOctKey from "./getOctKey";
import { TokenPayloadCodec } from "./TokenPayload";

// eslint-disable-next-line require-await
export default async function verifyToken(token: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      console.log("verifying token", token);
      const rawPayload = JWT.verify(token, getOctKey());
      const payload = decodeThrow(TokenPayloadCodec, rawPayload);
      console.log("token decoded", payload);

      return resolve(payload.sub);
    } catch (e) {
      console.error("Verify token error");
      console.log(e);
    }
    return reject("Unauthorized");
  });
}
