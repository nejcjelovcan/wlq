import { ParticipantAnsweredMessage } from "@wlq/wlq-core/lib/api/game/answerQuestion.websocket";
import { GameFinishedMessage } from "@wlq/wlq-core/lib/api/game/NextQuestionMessages";
import { RevealAnswerMessage } from "@wlq/wlq-core/lib/api/game/revealAnswer";
import {
  ParticipantAnswer,
  PosedQuestionPublic,
  RoomPublic
} from "@wlq/wlq-core/lib/model";
import { mutate, Operator } from "overmind";

export const sendLoadRoom: () => Operator<{ room: RoomPublic }> = () =>
  mutate(function sendLoadRoom({ state }, { room }) {
    if (state.current === "Room") {
      state.roomSession.room.send("LoadRoom", { room });
    }
  });

export const sendPoseQuestion: () => Operator<{
  question: PosedQuestionPublic;
}> = () =>
  mutate(function sendPoseQuestion({ state }, { question }) {
    if (state.current === "Room") {
      state.roomSession.room.send("PoseQuestion", { question });
    }
  });

export const sendRevealAnswer: () => Operator<
  RevealAnswerMessage["data"]
> = () =>
  mutate(function sendRevealAnswer({ state }, data) {
    if (state.current === "Room") {
      state.roomSession.room.send("RevealAnswer", data);
    }
  });

export const sendParticipantAnswered: () => Operator<
  ParticipantAnsweredMessage["data"]
> = () =>
  mutate(function sendParticipantAnswered({ state }, data) {
    if (state.current === "Room") {
      state.roomSession.room.send("ParticipantAnswered", data);
    }
  });

export const sendGameFinished: () => Operator<
  GameFinishedMessage["data"]
> = () =>
  mutate(function sendGameFinished({ state }, data) {
    if (state.current === "Room") {
      state.roomSession.room.send("GameFinished", data);
    }
  });

export const sendAnswerQuestion: () => Operator<ParticipantAnswer> = () =>
  mutate(function sendAnswerQuestion({ state }, data) {
    if (state.current === "Room") {
      state.roomSession.room.send("AnswerQuestion", data);
    }
  });
