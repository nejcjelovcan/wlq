import { JWT } from "jose";
import getOctKey from "./getOctKey";
import verifyToken from "./verifyToken";

describe("verifyToken", () => {
  it("rejects promise for invalid token", async () => {
    await expect(verifyToken("test")).rejects.toEqual("Unauthorized");
  });
  it("rejects promise for valid token that doesn't have a sub property", async () => {
    const token = JWT.sign({ test: "123" }, getOctKey());
    await expect(verifyToken(token)).rejects.toEqual("Unauthorized");
  });
  it("resolves promise for valid token with sub property", async () => {
    const token = JWT.sign({ sub: "123" }, getOctKey());
    await expect(verifyToken(token)).resolves.toEqual("123");
  });
});
