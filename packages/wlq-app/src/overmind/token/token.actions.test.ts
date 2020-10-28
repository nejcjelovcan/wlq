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
    it("requests token via REST if not in local storage (and writes to storage)", async () => {
      const setItem = jest.fn();
      const overmind = createOvermindMock(config, {
        localStorage: {
          getItem: () => {
            throw new LocalStorageError();
          },
          setItem
        },
        rest: {
          getToken: () =>
            new Promise(resolve => resolve({ token: "tokenValue" }))
        }
      });

      await overmind.actions.token.assureToken();
      if (overmind.state.token.current !== "Loaded")
        throw new Error("Expected current=Loaded");

      expect(overmind.state.token.token).toBe("tokenValue");
      expect(setItem.mock.calls.length).toBe(1);
      expect(setItem.mock.calls[0]).toEqual(["token", "tokenValue"]);
    });
  });
});
