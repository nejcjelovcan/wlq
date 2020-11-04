import { userDetailsFixture } from "@wlq/wlq-core/lib/model/fixtures";
import { createOvermindMock } from "overmind";
import { config } from "../";
import { withEffectMocks } from "../../__test__/overmindMocks";

describe("router.actions", () => {
  describe("setPageIndex", () => {
    it("updates current page to Index", async () => {
      const overmind = createOvermindMock(config);

      await overmind.actions.router.setPageIndex();

      expect(overmind.state.current).toBe("Index");
    });
  });
  describe("setPageNew", () => {
    it("redirects to settings if user is not valid", async () => {
      const open = jest.fn();
      const overmind = createOvermindMock(config, { router: { open } });

      await overmind.actions.router.setPageNew({});

      expect(open.mock.calls.length).toBe(1);
      expect(open.mock.calls[0]).toEqual(["/settings"]);
    });
    it("updates current page to New", async () => {
      const overmind = createOvermindMock(config, withEffectMocks());

      await overmind.actions.user.updateDetails(userDetailsFixture());
      await overmind.actions.router.setPageNew({});

      expect(overmind.state.current).toBe("New");
    });
  });
  describe("setPageRoom", () => {
    it("redirects to settings if user is not valid", async () => {
      const open = jest.fn();
      const overmind = createOvermindMock(config, { router: { open } });

      await overmind.actions.router.setPageRoom({ roomId: "roomId" });

      expect(open.mock.calls.length).toBe(1);
      expect(open.mock.calls[0]).toEqual(["/settings?roomId=roomId"]);
    });
    it("updates current page to Room (with params)", async () => {
      const overmind = createOvermindMock(config, withEffectMocks());

      // setPageRoom uses waitUntilTokenLoaded
      await overmind.actions.user.updateDetails(userDetailsFixture());
      await overmind.actions.token.assureToken();

      await overmind.actions.router.setPageRoom({ roomId: "roomId" });
      if (overmind.state.current !== "Room")
        throw new Error("Expected current=Room");

      expect(overmind.state.params).toStrictEqual({ roomId: "roomId" });
    });
    it("fails if params are invalid", async () => {
      const open = jest.fn();
      const overmind = createOvermindMock(config, {
        router: { open }
      });

      await overmind.actions.router.setPageRoom({ invalid: "roomId" });
      if (overmind.state.current !== "Index")
        throw new Error("Expected current=Index");

      expect(open.mock.calls.length).toBe(1);
    });
  });
  describe("setPageSettings", () => {
    it("updates current page to Settings (no params)", async () => {
      const overmind = createOvermindMock(config);

      await overmind.actions.router.setPageSettings({});
      if (overmind.state.current !== "Settings")
        throw new Error("Expected current=Settings");

      expect(overmind.state.params).toStrictEqual({});
    });
    it("updates current page to Settings (with params)", async () => {
      const overmind = createOvermindMock(config);

      await overmind.actions.router.setPageSettings({ next: "test" });
      if (overmind.state.current !== "Settings")
        throw new Error("Expected current=Settings");

      expect(overmind.state.params).toStrictEqual({ next: "test" });
    });
  });
});
