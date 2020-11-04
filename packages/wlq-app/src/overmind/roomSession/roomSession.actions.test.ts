import {
  participantFixture,
  posedQuestionPublicFixture,
  roomPublicFixture,
  userDetailsFixture
} from "@wlq/wlq-core/lib/model/fixtures";
import { createOvermindMock } from "overmind";
import { config } from "../";
import { EffectMocks, withEffectMocks } from "../../__test__/overmindMocks";

const room = roomPublicFixture();

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
        const participant = participantFixture();

        await overmind.actions.user.updateDetails(userDetailsFixture());
        await overmind.actions.token.assureToken();
        await overmind.actions.router.setPageRoom({ roomId: room.roomId });
        await overmind.actions.roomSession.roomOnMessage(
          new MessageEvent("", {
            data: JSON.stringify({
              action: "setParticipants",
              data: {
                participants: [participant],
                pid: "pid"
              }
            })
          })
        );
        if (overmind.state.current !== "Room")
          throw new Error("Expected state.current=Room");
        if (overmind.state.roomSession.current !== "Joined")
          throw new Error("Expected state.roomSession.current=Joined");

        expect(overmind.state.roomSession.participants).toEqual([participant]);
        expect(overmind.state.roomSession.pid).toEqual("pid");
      });
    });

    describe("participantJoined", () => {
      it("adds a participant to participants", async () => {
        const overmind = createOvermindMock(
          config,
          withEffectMocks(roomEffects)
        );

        await overmind.actions.user.updateDetails(userDetailsFixture());
        await overmind.actions.token.assureToken();
        await overmind.actions.router.setPageRoom({ roomId: room.roomId });
        await overmind.actions.roomSession.setParticipants({
          action: "setParticipants",
          data: {
            participants: [participantFixture()],
            pid: "pid"
          }
        });

        const participant2 = participantFixture({ pid: "participant2Pid" });
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

    describe("participantLeft", () => {
      it("removes a participant from participants", async () => {
        const overmind = createOvermindMock(
          config,
          withEffectMocks(roomEffects)
        );

        await overmind.actions.user.updateDetails(userDetailsFixture());
        await overmind.actions.token.assureToken();
        await overmind.actions.router.setPageRoom({ roomId: room.roomId });
        await overmind.actions.roomSession.setParticipants({
          action: "setParticipants",
          data: {
            participants: [participantFixture({ pid: "pid" })],
            pid: "pid"
          }
        });

        await overmind.actions.roomSession.roomOnMessage(
          new MessageEvent("", {
            data: JSON.stringify({
              action: "participantLeft",
              data: { pid: "pid" }
            })
          })
        );

        if (overmind.state.current !== "Room")
          throw new Error("Expected state.current=Room");
        if (overmind.state.roomSession.current !== "Joined")
          throw new Error("Expected state.roomSession.current=Joined");

        expect(overmind.state.roomSession.participants.length).toEqual(0);
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
      const userDetails = userDetailsFixture();

      await overmind.actions.user.updateDetails(userDetailsFixture());
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

  describe("startGame", () => {
    it("sends startGame message via websocket", async () => {
      const sendMessage = jest.fn();
      const overmind = createOvermindMock(
        config,
        withEffectMocks(roomEffects, { websocket: { sendMessage } })
      );
      const userDetails = userDetailsFixture();

      await overmind.actions.user.updateDetails(userDetailsFixture());
      await overmind.actions.token.assureToken();
      await overmind.actions.user.updateDetails(userDetails);
      await overmind.actions.router.setPageRoom({ roomId: room.roomId });
      if (overmind.state.current !== "Room")
        throw new Error("Expected state.current=Room");

      overmind.actions.roomSession.setParticipants({
        action: "setParticipants",
        data: { participants: [], pid: "pid" }
      });

      await overmind.actions.roomSession.startGame();

      expect(sendMessage.mock.calls.length).toBe(1);
      expect(sendMessage.mock.calls[0]).toEqual([
        {
          action: "startGame",
          data: {}
        }
      ]);
    });
  });

  describe("poseQuestion", () => {
    it("sets game to current=Question and populates question property", async () => {
      const overmind = createOvermindMock(config, withEffectMocks(roomEffects));

      await overmind.actions.user.updateDetails(userDetailsFixture());
      await overmind.actions.token.assureToken();
      await overmind.actions.router.setPageRoom({ roomId: room.roomId });
      await overmind.actions.roomSession.setParticipants({
        action: "setParticipants",
        data: {
          participants: [participantFixture({ pid: "pid" })],
          pid: "pid"
        }
      });

      const question = posedQuestionPublicFixture();

      await overmind.actions.roomSession.roomOnMessage(
        new MessageEvent("", {
          data: JSON.stringify({
            action: "poseQuestion",
            data: { question }
          })
        })
      );

      if (overmind.state.current !== "Room")
        throw new Error("Expected state.current=Room");
      if (overmind.state.roomSession.current !== "Joined")
        throw new Error("Expected state.roomSession.current=Joined");
      if (overmind.state.roomSession.room.current !== "Game")
        throw new Error("Expected state.roomSession.room.current=Game");
      if (overmind.state.roomSession.room.game.current !== "Question")
        throw new Error(
          "Expected state.roomSession.room.game.current=Question"
        );

      expect(overmind.state.roomSession.room.game.question).toEqual(question);
    });
  });

  describe("revealAnswer", () => {
    it("sets game to current=Answer and populates answers property", async () => {
      const overmind = createOvermindMock(config, withEffectMocks(roomEffects));

      await overmind.actions.user.updateDetails(userDetailsFixture());
      await overmind.actions.token.assureToken();
      await overmind.actions.router.setPageRoom({ roomId: room.roomId });
      await overmind.actions.roomSession.setParticipants({
        action: "setParticipants",
        data: {
          participants: [participantFixture({ pid: "pid" })],
          pid: "pid"
        }
      });

      await overmind.actions.roomSession.poseQuestion({
        action: "poseQuestion",
        data: { question: posedQuestionPublicFixture() }
      });

      await overmind.actions.roomSession.roomOnMessage(
        new MessageEvent("", {
          data: JSON.stringify({
            action: "revealAnswer",
            data: {
              answer: "Answer",
              answers: [{ pid: "pid", answer: "Answer" }]
            }
          })
        })
      );

      if (overmind.state.current !== "Room")
        throw new Error("Expected state.current=Room");
      if (overmind.state.roomSession.current !== "Joined")
        throw new Error("Expected state.roomSession.current=Joined");
      if (overmind.state.roomSession.room.current !== "Game")
        throw new Error("Expected state.roomSession.room.current=Game");
      if (overmind.state.roomSession.room.game.current !== "Answer")
        throw new Error("Expected state.roomSession.room.game.current=Answer");

      expect(overmind.state.roomSession.room.game.answer).toEqual("Answer");
      expect(overmind.state.roomSession.room.game.answers).toEqual([
        { pid: "pid", answer: "Answer" }
      ]);
    });
  });

  describe("participantAnswered", () => {
    it("adds participant pid to answeredParticipants", async () => {
      const overmind = createOvermindMock(config, withEffectMocks(roomEffects));

      await overmind.actions.user.updateDetails(userDetailsFixture());
      await overmind.actions.token.assureToken();
      await overmind.actions.router.setPageRoom({ roomId: room.roomId });
      await overmind.actions.roomSession.setParticipants({
        action: "setParticipants",
        data: {
          participants: [participantFixture({ pid: "pid" })],
          pid: "pid"
        }
      });

      await overmind.actions.roomSession.poseQuestion({
        action: "poseQuestion",
        data: { question: posedQuestionPublicFixture() }
      });

      await overmind.actions.roomSession.roomOnMessage(
        new MessageEvent("", {
          data: JSON.stringify({
            action: "participantAnswered",
            data: {
              pid: "pid"
            }
          })
        })
      );

      if (overmind.state.current !== "Room")
        throw new Error("Expected state.current=Room");
      if (overmind.state.roomSession.current !== "Joined")
        throw new Error("Expected state.roomSession.current=Joined");
      if (overmind.state.roomSession.room.current !== "Game")
        throw new Error("Expected state.roomSession.room.current=Game");
      if (overmind.state.roomSession.room.game.current !== "Question")
        throw new Error(
          "Expected state.roomSession.room.game.current=Question"
        );

      expect(
        overmind.state.roomSession.room.game.answeredParticipants
      ).toEqual(["pid"]);
    });

    it("adds participant pid to answeredParticipants even if current is already Answer", async () => {
      const overmind = createOvermindMock(config, withEffectMocks(roomEffects));

      await overmind.actions.user.updateDetails(userDetailsFixture());
      await overmind.actions.token.assureToken();
      await overmind.actions.router.setPageRoom({ roomId: room.roomId });
      await overmind.actions.roomSession.setParticipants({
        action: "setParticipants",
        data: {
          participants: [participantFixture({ pid: "pid" })],
          pid: "pid"
        }
      });

      await overmind.actions.roomSession.poseQuestion({
        action: "poseQuestion",
        data: { question: posedQuestionPublicFixture() }
      });

      await overmind.actions.roomSession.revealAnswer({
        action: "revealAnswer",
        data: { answer: "Answer", answers: [] }
      });

      await overmind.actions.roomSession.roomOnMessage(
        new MessageEvent("", {
          data: JSON.stringify({
            action: "participantAnswered",
            data: {
              pid: "pid"
            }
          })
        })
      );

      if (overmind.state.current !== "Room")
        throw new Error("Expected state.current=Room");
      if (overmind.state.roomSession.current !== "Joined")
        throw new Error("Expected state.roomSession.current=Joined");
      if (overmind.state.roomSession.room.current !== "Game")
        throw new Error("Expected state.roomSession.room.current=Game");
      if (overmind.state.roomSession.room.game.current !== "Answer")
        throw new Error("Expected state.roomSession.room.game.current=Answer");

      expect(
        overmind.state.roomSession.room.game.answeredParticipants
      ).toEqual(["pid"]);
    });
  });

  describe("gameFinished", () => {
    it("sets game state to finished", async () => {
      const overmind = createOvermindMock(config, withEffectMocks(roomEffects));

      await overmind.actions.user.updateDetails(userDetailsFixture());
      await overmind.actions.token.assureToken();
      await overmind.actions.router.setPageRoom({ roomId: room.roomId });
      await overmind.actions.roomSession.setParticipants({
        action: "setParticipants",
        data: {
          participants: [participantFixture({ pid: "pid" })],
          pid: "pid"
        }
      });

      await overmind.actions.roomSession.poseQuestion({
        action: "poseQuestion",
        data: { question: posedQuestionPublicFixture() }
      });

      await overmind.actions.roomSession.roomOnMessage(
        new MessageEvent("", {
          data: JSON.stringify({
            action: "gameFinished",
            data: {}
          })
        })
      );

      if (overmind.state.current !== "Room")
        throw new Error("Expected state.current=Room");
      if (overmind.state.roomSession.current !== "Joined")
        throw new Error("Expected state.roomSession.current=Joined");
      if (overmind.state.roomSession.room.current !== "Game")
        throw new Error("Expected state.roomSession.room.current=Game");

      expect(overmind.state.roomSession.room.game.current).toBe("Finished");
    });
  });
});
