import { decodeThrow } from "@wlq/wlq-core";
import { NewRoomCodec } from "@wlq/wlq-core/lib/model";
import { catchError, filter, json, mutate, Operator } from "overmind";

export const validateNewRoomData: <T>() => Operator<T> = () =>
  mutate(function validateNewRoomData({ state: { newRoom } }) {
    decodeThrow(NewRoomCodec, json(newRoom.newRoomData));
  });

export const shouldSubmitNewRoom: <T>() => Operator<T> = () =>
  filter(function shouldSubmitNewRoom({ state: { newRoom } }) {
    return newRoom.current !== "Submitting";
  });

export const submitNewRoom: <T>() => Operator<T> = () =>
  mutate(async function submitNewRoom({
    state: { newRoom },
    effects: { rest }
  }) {
    newRoom.send("NewRoomSubmit");
    const { room } = await rest.createRoom(
      decodeThrow(NewRoomCodec, json(newRoom.newRoomData))
    );
    newRoom.send("NewRoomReceive", { room });
  });

export const handleNewRoomError: () => Operator = () =>
  catchError(function handleNewRoomError({ state: { newRoom } }, error) {
    newRoom.send("NewRoomError", { error: error.message });
  });

export const passToRoomSession: <T>() => Operator<T> = () =>
  mutate(function passToRoomSession({
    state: { newRoom },
    actions: {
      roomSession: { setRoom }
    }
  }) {
    if (newRoom.current === "Created") {
      setRoom({ ...newRoom.room });
      // goToRoom({ roomId: newRoom.room.roomId });
    }
  });
