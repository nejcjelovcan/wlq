import { IWebsocketMessage } from "@wlq/wlq-core";
import { SetParticipantsMessage } from "@wlq/wlq-core/lib/api/room/JoinRoomMessages";
import { RoomPublic } from "@wlq/wlq-core/lib/model";
import * as e from "fp-ts/Either";
import { filter, map, mutate, Operator, pipe, run } from "overmind";
import { fold, waitUntilTokenLoaded } from "../operators";
import { sendLoadRoom } from "./room/room.operators";

/* === Filters & waits === */

export const ifRoomNotLoaded: <T>() => Operator<T> = () =>
  filter(function ifRoomNotLoaded({ state }) {
    if (state.current !== "Room") return false;
    if (state.roomSession.request.current === "Init") return true;

    return false;
  });

/* === State machine operators === */

export const sendJoin: <T>() => Operator<T> = () =>
  mutate(function sendJoin({ state }) {
    if (state.current === "Room") {
      state.roomSession.send("Join");
    }
  });

export const sendJoined: () => Operator<SetParticipantsMessage> = () =>
  mutate(function sendJoined({ state }, message) {
    if (state.current === "Room") {
      state.roomSession.send("Joined", message);
    }
  });

export const sendRequest: <T>() => Operator<T> = () =>
  mutate(function sendRequest({ state }) {
    if (state.current === "Room") {
      state.roomSession.request.send("Request");
    }
  });

export const sendReceive: <T>() => Operator<T> = () =>
  mutate(function sendReceive({ state }) {
    if (state.current === "Room") {
      state.roomSession.request.send("Response");
    }
  });

export const sendError: () => Operator<Error> = () =>
  mutate(function sendError({ state }, error) {
    if (state.current === "Room") {
      state.roomSession.request.send("Error", { error: error.message });
    }
  });

export const openRoomFromCreate: () => Operator<{ room: RoomPublic }> = () =>
  pipe(
    mutate(function setRoomFromCreate({ state }, { room }) {
      state.send("SetRoomFromCreate", { room });
    }),
    run(function openRoom(
      {
        actions: {
          router: { open }
        }
      },
      { room }
    ) {
      open({ path: `/room/${room.roomId}` });
    }),
    sendJoin(),
    openWebsocket()
  );

/* === Request operators === */

export const requestRoom: () => Operator = () =>
  pipe(
    waitUntilTokenLoaded(),
    sendRequest(),
    map(async function requestRoom({ state, effects: { rest } }) {
      try {
        if (state.current === "Room" && state.roomSession.current === "Init") {
          return e.right(await rest.getRoom(state.params));
        } else {
          return e.left(new Error("Unexpected state"));
        }
      } catch (error) {
        return e.left(error);
      }
    }),
    fold({
      success: pipe(sendReceive(), sendLoadRoom(), sendJoin(), openWebsocket()),
      error: sendError()
    })
  );

/* === Websocket operators === */

export const openWebsocket: <T>() => Operator<T> = () =>
  run(function openWebsocket({
    state,
    actions: {
      roomSession: { roomOnMessage, joinRoom }
    },
    effects: { websocket }
  }) {
    if (
      state.current === "Room" &&
      state.roomSession.room.current !== "Empty"
    ) {
      websocket.initialize(state.roomSession.room.websocket);
      websocket.setOnMessage(roomOnMessage);
      websocket.setOnOpen(joinRoom);
    }
  });

export const getMessage: () => Operator<MessageEvent, IWebsocketMessage> = () =>
  map(function getMessage(_, event) {
    try {
      const message = JSON.parse(event.data);
      if ("action" in message && typeof message.action === "string") {
        if ("data" in message && typeof message.data === "object") {
          return { action: message.action, data: message.data };
        }
      }
    } catch (error) {}
    return { action: "error", data: { error: "Could not parse message" } };
  });
