import { nanoid } from "nanoid";
import { JWT } from "jose";
import { TokenPayload } from "./TokenPayload";
import getOctKey from "./getOctKey";

export default function newToken(): string {
  const payload: TokenPayload = { sub: nanoid() };
  return JWT.sign(payload, getOctKey());
}
