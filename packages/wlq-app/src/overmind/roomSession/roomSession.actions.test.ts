import { createOvermindMock } from "overmind";
import { config } from "../";
import { withEffectMocks, EffectMocks } from "../../__test__/overmindMocks";
import { room, participant, userDetails } from "../../__test__/fixtures";

const roomEffects: EffectMocks = {
  rest: {
    getRoom: () => new Promise(resolve => resolve({ room }))
  }
};

describe("roomSession.actions", () => {
  describe("roomOnMessage", () => {
    describe("setParticipants", () => {
      it("sets state to joined and sets participants array and pid value", async () => {
        const overmind = createOvermindMock(
          config,
          withEffectMocks(roomEffects)
        );
        const part = participant();

        await overmind.actions.token.assureToken();
        await overmind.actions.router.setPageRoom({ roomId: room.roomId });
        await overmind.actions.roomSession.roomOnMessage(
          new MessageEvent("", {
            data: JSON.stringify({
              action: "setParticipants",
              data: {
                participants: [part],
                pid: "pid"
              }
            })
          })
        );
        if (overmind.state.current !== "Room")
          throw new Error("Expected state.current=Room");
        if (overmind.state.roomSession.current !== "Joined")
          throw new Error("Expected state.roomSession.current=Joined");

        expect(overmind.state.roomSession.participants).toEqual([part]);
        expect(overmind.state.roomSession.pid).toEqual("pid");
      });
    });

    describe("participantJoined", () => {
      it("adds a participant to participants", async () => {
        const overmind = createOvermindMock(
          config,
          withEffectMocks(roomEffects)
        );

        await overmind.actions.token.assureToken();
        await overmind.actions.router.setPageRoom({ roomId: room.roomId });
        await overmind.actions.roomSession.setParticipants({
          action: "setParticipants",
          data: {
            participants: [participant()],
            pid: "pid"
          }
        });

        const participant2 = participant({ pid: "participant2Pid" });
        await overmind.actions.roomSession.roomOnMessage(
          new MessageEvent("", {
            data: JSON.stringify({
              action: "participantJoined",
              data: { participant: participant2 }
            })
          })
        );

        if (overmind.state.current !== "Room")
          throw new Error("Expected state.current=Room");
        if (overmind.state.roomSession.current !== "Joined")
          throw new Error("Expected state.roomSession.current=Joined");

        expect(overmind.state.roomSession.participants[1]).toStrictEqual(
          participant2
        );
      });
    });
  });

  describe("joinRoom", () => {
    it("sends joinRoom message via websocket", async () => {
      const sendMessage = jest.fn();
      const overmind = createOvermindMock(
        config,
        withEffectMocks(roomEffects, { websocket: { sendMessage } })
      );

      await overmind.actions.token.assureToken();
      await overmind.actions.user.updateDetails(userDetails);
      await overmind.actions.router.setPageRoom({ roomId: room.roomId });

      await overmind.actions.roomSession.joinRoom();

      expect(sendMessage.mock.calls.length).toBe(1);
      expect(sendMessage.mock.calls[0]).toEqual([
        {
          action: "joinRoom",
          data: {
            details: userDetails,
            roomId: room.roomId,
            token: "tokenValue"
          }
        }
      ]);
    });
  });
});
