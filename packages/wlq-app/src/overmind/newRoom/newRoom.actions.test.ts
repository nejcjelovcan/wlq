import { createOvermindMock } from "overmind";
import { config } from "../";
import { room } from "../../__test__/fixtures";
import { withEffectMocks } from "../../__test__/overmindMocks";

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

  describe("submitNewRoom", () => {
    it("submits new room and redirects to room", async () => {
      const overmind = createOvermindMock(
        config,
        withEffectMocks({
          rest: {
            createRoom: _ => {
              return new Promise(resolve => resolve({ room }));
            }
          }
        })
      );

      await overmind.actions.token.assureToken();
      await overmind.actions.router.setPageNew();
      await overmind.actions.newRoom.submitNewRoom();

      // should redirect to Room
      if (overmind.state.current !== "Room")
        throw new Error("Expected state.current=Room");

      expect(overmind.state.roomSession.room).toMatchObject(room);
    });

    it("handles error response", async () => {
      const overmind = createOvermindMock(
        config,
        withEffectMocks({
          rest: {
            createRoom: _ => {
              throw new Error("Response error");
            }
          }
        })
      );

      await overmind.actions.token.assureToken();
      await overmind.actions.router.setPageNew();
      await overmind.actions.newRoom.submitNewRoom();

      // should redirect to Room
      if (overmind.state.current !== "New")
        throw new Error("Expected state.current=New");

      expect(overmind.state.newRoom.request).toMatchObject({
        current: "Error",
        error: "Response error"
      });
    });
  });
});
