import { createOvermindMock } from "overmind";
import { config } from "../";
import { LocalStorageError } from "../effects/localStorage";
import { withEffectMocks } from "../../__test__/overmindMocks";

describe("token.actions", () => {
  describe("assureToken", () => {
    it("loads token from localStorage", async () => {
      const setAuthorization = jest.fn();

      const overmind = createOvermindMock(
        config,
        withEffectMocks({
          rest: { setAuthorization }
        })
      );

      await overmind.actions.token.assureToken();
      if (overmind.state.token.current !== "Loaded")
        throw new Error("Expected current=Loaded");

      expect(overmind.state.token.token).toBe("tokenValue");
      expect(setAuthorization.mock.calls.length).toBe(1);
      expect(setAuthorization.mock.calls[0]).toEqual(["tokenValue"]);
    });
    it("requests token via REST if not in local storage (and writes to storage)", async () => {
      const setItem = jest.fn();
      const setAuthorization = jest.fn();
      const overmind = createOvermindMock(config, {
        localStorage: {
          getItem: () => {
            throw new LocalStorageError();
          },
          setItem
        },
        rest: {
          getToken: () =>
            new Promise(resolve => resolve({ token: "tokenValue" })),
          setAuthorization
        }
      });

      await overmind.actions.token.assureToken();
      if (overmind.state.token.current !== "Loaded")
        throw new Error("Expected current=Loaded");

      expect(overmind.state.token.token).toBe("tokenValue");
      expect(setItem.mock.calls.length).toBe(1);
      expect(setItem.mock.calls[0]).toEqual(["token", "tokenValue"]);
      expect(setAuthorization.mock.calls.length).toBe(1);
      expect(setAuthorization.mock.calls[0]).toEqual(["tokenValue"]);
    });
  });
});
