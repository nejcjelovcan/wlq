import { userDetailsFixture } from "@wlq/wlq-core/lib/model/fixtures";
import { createOvermindMock } from "overmind";
import { config } from "../";
import { LocalStorageError } from "../effects/localStorage";

describe("user.actions", () => {
  describe("updateDetails", () => {
    it("updates partialDetails and errors in user state", async () => {
      const overmind = createOvermindMock(config);

      await overmind.actions.user.updateDetails({ color: "red" });
      if (overmind.state.user.current !== "Partial")
        throw new Error("Expected current=Partial");

      const { partialDetails, errors } = overmind.state.user;

      expect(partialDetails).toStrictEqual({
        type: "UserDetails",
        color: "red"
      });
      expect(errors).toStrictEqual({
        emoji: ["Invalid value", "undefined"],
        alias: ["Invalid value", "undefined"]
      });
    });

    it("sets state to valid and writes to storage if details is valid", async () => {
      const setItem = jest.fn();
      const overmind = createOvermindMock(config, {
        localStorage: { setItem }
      });
      const userDetails = userDetailsFixture();
      await overmind.actions.user.updateDetails(userDetails);

      if (overmind.state.user.current !== "Valid")
        throw new Error("Expected current=Valid");

      expect(overmind.state.user.validDetails).toStrictEqual(userDetails);
      expect(setItem.mock.calls.length).toBe(1);
      expect(setItem.mock.calls[0]).toEqual([
        "userDetails",
        JSON.stringify(userDetails)
      ]);
    });
  });

  describe("loadOrRandomizeDetails", () => {
    it("loads valid details if present in localStorage", async () => {
      const userDetails = userDetailsFixture();
      const overmind = createOvermindMock(config, {
        localStorage: { getItem: _ => JSON.stringify(userDetails) }
      });

      await overmind.actions.user.loadOrRandomizeDetails();
      if (overmind.state.user.current !== "Valid")
        throw new Error("Expected current=Valid");

      const { validDetails } = overmind.state.user;

      expect(validDetails).toStrictEqual(userDetails);
    });

    it("randomizes color and emoji if details in localStorage is invalid", async () => {
      const overmind = createOvermindMock(config, {
        localStorage: {
          getItem: _ => JSON.stringify({ type: "UserDetails" })
        }
      });

      await overmind.actions.user.loadOrRandomizeDetails();
      if (overmind.state.user.current !== "Partial")
        throw new Error("Expected current=Valid");

      const { partialDetails } = overmind.state.user;

      expect(typeof partialDetails.color).toBe("string");
      expect(typeof partialDetails.emoji).toBe("string");
    });

    it("randomizes color and emoji if details in localStorage do not exist", async () => {
      const overmind = createOvermindMock(config, {
        localStorage: {
          getItem: _ => {
            throw new LocalStorageError("Not found");
          }
        }
      });

      await overmind.actions.user.loadOrRandomizeDetails();
      if (overmind.state.user.current !== "Partial")
        throw new Error("Expected current=Valid");

      const { partialDetails } = overmind.state.user;

      expect(typeof partialDetails.color).toBe("string");
      expect(typeof partialDetails.emoji).toBe("string");
    });
  });
});
