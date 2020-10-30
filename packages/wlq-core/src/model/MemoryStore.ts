/* eslint-disable require-await */
import IStore, {
  ExistsStoreError,
  NotFoundStoreError,
  StateStoreError
} from "./IStore";
import { Participant } from "./room/participant/Participant";
import { Room } from "./room/Room";

export function newMemoryStore(): IStore {
  const rooms: { [key: string]: Room } = {};
  const participants: { [key: string]: Participant } = {};

  const _getRoom = (roomId: string): Room => {
    if (!rooms[roomId]) throw new NotFoundStoreError("Room not found");
    return rooms[roomId];
  };

  const _getParticipant = (connectionId: string): Participant => {
    if (!participants[connectionId])
      throw new NotFoundStoreError("participant not found");
    return participants[connectionId];
  };

  return {
    async getRoom({ roomId }) {
      return _getRoom(roomId);
    },

    async addRoom(room) {
      if (rooms[room.roomId]) throw new ExistsStoreError("Room exists");
      rooms[room.roomId] = room;
      return room;
    },

    async deleteRoom({ roomId }) {
      _getRoom(roomId);
      delete rooms[roomId];
    },

    async listRooms() {
      return Object.values(rooms);
    },

    async getParticipants({ roomId }) {
      return Object.values(participants).filter(p => p.roomId === roomId);
    },

    async getParticipant({ connectionId }) {
      return _getParticipant(connectionId);
    },

    async addParticipant(participant) {
      if (participants[participant.connectionId])
        throw new ExistsStoreError("Participant exists");
      participants[participant.connectionId] = participant;
      const room = _getRoom(participant.roomId);
      room.participantCount += 1;
      return room;
    },

    async deleteParticipant(participant) {
      _getParticipant(participant.connectionId);
      const room = _getRoom(participant.roomId);
      room.participantCount -= 1;
      return room;
    },

    async getParticipantAndRoom({ connectionId }) {
      const participant = _getParticipant(connectionId);
      return [participant, _getRoom(participant.roomId)];
    },

    async addAnswer({ roomId, pid, answer }) {
      const room = _getRoom(roomId);
      if (room.current === "Game" && room.game.current === "Question") {
        room.game.answers.push({ pid, answer });
        return room;
      } else {
        throw new StateStoreError(
          "Room must be in state='Game' and game in state='Answer'"
        );
      }
    }
  };
}
