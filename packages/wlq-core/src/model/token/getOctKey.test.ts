import { JWK } from "jose";
import getOctKey from "./getOctKey";

describe("getOctKey", () => {
  it("creates new instance of jose.JWK from env variable API_OCT_SECRET_KEY", () => {
    expect(JWK.isKey(getOctKey())).toBe(true);
  });
});
