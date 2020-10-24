import { JWK } from "jose";

export default function getOctKey() {
  return JWK.asKey(process.env.API_OCT_SECRET_KEY!);
}
