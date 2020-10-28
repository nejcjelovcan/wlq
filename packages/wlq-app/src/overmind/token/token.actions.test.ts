import { createOvermindMock } from "overmind";
import { config } from "../";
import { LocalStorageError } from "../effects/localStorage";

describe("token.actions", () => {
  describe("assureToken", () => {
    it("loads token from localStorage", async () => {
      const overmind = createOvermindMock(config, {
        localStorage: { getItem: () => "token" }
      });

      await overmind.actions.token.assureToken();
      if (overmind.state.token.current !== "Loaded")
        throw new Error("Expected current=Loaded");

      expect(overmind.state.token.token).toBe("token");
    });
    it("requests token via REST if not in local storage", async () => {
      const overmind = createOvermindMock(config, {
        localStorage: {
          getItem: () => {
            throw new LocalStorageError();
          }
        },
        rest: {
          getToken: () => new Promise(resolve => resolve({ token: "token" }))
        }
      });

      await overmind.actions.token.assureToken();
      if (overmind.state.token.current !== "Loaded")
        throw new Error("Expected current=Loaded");

      expect(overmind.state.token.token).toBe("token");
    });
  });
});
