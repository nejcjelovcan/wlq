import { resolveCodecEither } from "@wlq/wlq-core";
import {
  NewRoom,
  NewRoomCodec,
  RoomKey,
  RoomPublic
} from "@wlq/wlq-core/lib/model";
import { Action, AsyncAction } from "overmind";

export const test = () => {};

export const setRoom: Action<RoomPublic> = ({ state }, room) => {
  const roomState = state.room.transition("Room");
  if (roomState) {
    roomState.room = room;
  }
};

export const setError: Action<string> = ({ state }, error) => {
  const errorState = state.room.transition("Error");
  if (errorState) {
    errorState.error = error;
  }
};

export const requestRoom: AsyncAction<RoomKey> = async (
  {
    state: { room },
    actions: {
      room: { setRoom, setError }
    },
    effects: { rest }
  },
  roomKey
) => {
  const requestedState = room.transition("Requested");
  if (requestedState) {
    try {
      const { room } = await rest.getRoom(roomKey);
      setRoom(room);
    } catch (e) {
      setError(e.message);
    }
  }
};

export const startNewRoom: Action = ({
  state: { room },
  actions: {
    room: { setNewRoomData }
  }
}) => {
  const newState = room.transition("New");
  if (newState) {
    setNewRoomData({ listed: true });
  }
};

export const setNewRoomData: Action<Partial<NewRoom>> = (
  { state: { room } },
  newRoomData
) => {
  if (room.matches("New")) {
    room.newRoom = { ...room.newRoom, ...newRoomData };
    try {
      resolveCodecEither(NewRoomCodec.decode(room.newRoom));
      room.valid = true;
    } catch (e) {
      room.valid = false;
    }
  }
};

export const requestCreateRoom: AsyncAction = async ({
  state: { room },
  actions: {
    room: { setRoom, setError }
  },
  effects: { rest }
}) => {
  const submittedState = room.transition("Submitted");
  if (submittedState) {
    try {
      const { room } = await rest.createRoom(submittedState.newRoom);
      setRoom(room);
    } catch (e) {
      setError(e.message);
    }
  }
};
