import { IWebsocketMessage } from "@wlq/wlq-core";
import { RoomKey, RoomPublic } from "@wlq/wlq-core/lib/model";
import { catchError, filter, map, mutate, Operator } from "overmind";

export const requestRoom: () => Operator<RoomKey> = () =>
  mutate(async function requestRoom({ state, effects: { rest } }, roomKey) {
    state.roomSession.send("RoomRequest", roomKey);
    const { room } = await rest.getRoom(roomKey);
    state.roomSession.send("RoomReceive", room);
  });

export const setRoom: () => Operator<RoomPublic> = () =>
  mutate(function setRoom({ state }, room) {
    state.roomSession.send("RoomReceive", room);
  });

export const shouldRequestRoom: <T>() => Operator<T> = () =>
  filter(function shouldRequestRoom({ state: { roomSession, router } }) {
    if (roomSession.current === "Init") return true;
    if (
      roomSession.current !== "Requesting" &&
      roomSession.current !== "Error"
    ) {
      if (
        router.currentPage.name === "Room" &&
        roomSession.room.roomId !== router.currentPage.roomId
      ) {
        return true;
      }
    }
    return false;
  });

export const handleRoomError: () => Operator = () =>
  catchError(function handleRoomError({ state: { roomSession } }, error) {
    roomSession.send("RoomError", { error: error.message });
  });

export const getWebsocketMessage: () => Operator<
  MessageEvent,
  IWebsocketMessage | undefined
> = () =>
  map((_, message) => {
    const data = JSON.parse(message.data);
    if (
      typeof data["action"] === "string" &&
      typeof data["data"] === "object"
    ) {
      return { action: data["action"], data: data["data"] };
    }
    return;
  });

export const openWebsocket: <T>() => Operator<T> = () =>
  mutate(function openWebsocket({
    state: { roomSession },
    actions: {
      roomSession: { receiveMessage, joinRoom }
    },
    effects: { websocket }
  }) {
    if (roomSession.current === "Loaded") {
      roomSession.send("RoomJoin");
      websocket.initialize(roomSession.room.websocket);
      websocket.setOnMessage(receiveMessage);
      websocket.setOnOpen(joinRoom);
    }
  });
