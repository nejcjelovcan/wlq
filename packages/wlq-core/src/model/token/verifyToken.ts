import { JWT } from "jose";
import resolveCodecEither from "../../api/resolveCodecEither";
import getOctKey from "./getOctKey";
import { TokenPayloadCodec } from "./TokenPayload";

// eslint-disable-next-line require-await
export default async function verifyToken(
  token: string
): Promise<string | undefined> {
  return new Promise<string>((resolve, reject) => {
    try {
      console.log("verifying token", token);
      const rawPayload = JWT.verify(token, getOctKey());
      const payload = resolveCodecEither(TokenPayloadCodec.decode(rawPayload));
      console.log("token decoded", payload);

      return resolve(payload.sub);
    } catch (err) {
      console.error("Verify error", err);
    }
    return reject("Unauthorized");
  });
}
