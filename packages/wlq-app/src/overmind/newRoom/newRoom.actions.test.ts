import { createOvermindMock } from "overmind";
import { config } from "../";

describe("newRoom.actions", () => {
  describe("updateNewRoom", () => {
    // currently room only has {listed: bool} which is pre-populated
    // so, it is always valid (going to change in the future when
    // we implement categories/sets etc.)
    it("sets state to valid if newRoom is valid (always)", async () => {
      const overmind = createOvermindMock(config);

      await overmind.actions.router.setPageNew();
      await overmind.actions.newRoom.updateNewRoom({ listed: false });
      if (overmind.state.current !== "New")
        throw new Error("Expected state.current=New");
      if (overmind.state.newRoom.current !== "Valid")
        throw new Error("Expected state.newRoom.current=Valid");

      const { validNewRoom } = overmind.state.newRoom;

      expect(validNewRoom).toStrictEqual({
        listed: false
      });
    });
  });
});
