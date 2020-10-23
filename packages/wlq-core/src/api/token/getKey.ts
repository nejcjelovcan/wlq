import { JWK } from "jose";

export default function getKey() {
  return JWK.asKey(process.env.API_OCT_SECRET_KEY!);
}
