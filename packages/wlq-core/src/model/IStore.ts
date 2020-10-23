import { NewGame } from "./game/newGame";
import { Participant, ParticipantKey } from "./room/participant/Participant";
import { Room, RoomKey } from "./room/Room";

export default interface IStore {
  getRoom: (roomKey: RoomKey) => Promise<Room>;
  addRoom: (room: Room) => Promise<Room>;
  deleteRoom: (roomKey: RoomKey) => Promise<void>;
  listRooms: () => Promise<Room[]>;

  getParticipants: (roomKey: RoomKey) => Promise<Participant[]>;
  getParticipant: (participantKey: ParticipantKey) => Promise<Participant>;
  addParticipant: (participant: Participant) => Promise<Room>;
  deleteParticipant: (participantKey: ParticipantKey) => Promise<Room>;

  getParticipantAndRoom: (
    participantKey: ParticipantKey
  ) => Promise<[Participant, Room]>;

  startGame: (roomKey: RoomKey, newGameParams: NewGame) => Promise<Room>;
  finishGame: (roomKey: RoomKey) => Promise<Room>;

  addAnswer: (addAnswer: {
    roomId: string;
    pid: string;
    answer: string;
  }) => Promise<Room>;
}
