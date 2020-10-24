import { NewGame } from "./game/newGame";
import { Participant, ParticipantKey } from "./room/participant/Participant";
import { Room, RoomKey } from "./room/Room";

export default interface IStore {
  /**
   * Get room
   *
   * Gets room by roomId
   * Should raise NotFoundStoreError if not found
   */
  getRoom: (roomKey: RoomKey) => Promise<Room>;

  /**
   * Add room
   *
   * Adds room to storage
   * Should raise ExistsStoreError if already existing (by roomId)
   */
  addRoom: (room: Room) => Promise<Room>;

  /**
   * Delete room
   *
   * Deletes room from storage
   * Should raise NotFoundStoreError if not found
   */
  deleteRoom: (roomKey: RoomKey) => Promise<void>;

  /**
   * List rooms
   */
  listRooms: () => Promise<Room[]>;

  /**
   * Get participants in a room
   */
  getParticipants: (roomKey: RoomKey) => Promise<Participant[]>;

  /**
   * Get single participant by connectionId
   *
   * Should raise NotFoundStoreError if not found
   */
  getParticipant: (participantKey: ParticipantKey) => Promise<Participant>;

  /**
   * Add participant
   *
   * Should also update Room's participantCount
   * Should raise ExistsStoreError if it already exists
   */
  addParticipant: (participant: Participant) => Promise<Room>;

  /**
   * Delete participant
   *
   * Should also update Room's participantCount
   * Should raise NotFoundStoreError if not found
   */
  deleteParticipant: (participantKey: ParticipantKey) => Promise<Room>;

  /**
   * Get participant and the room it belongs to
   *
   * Should raise NotFoundStoreError if either participant or room not found
   */
  getParticipantAndRoom: (
    participantKey: ParticipantKey
  ) => Promise<[Participant, Room]>;

  startGame?: (roomKey: RoomKey, newGameParams: NewGame) => Promise<Room>;
  finishGame?: (roomKey: RoomKey) => Promise<Room>;

  /**
   * Add answer
   *
   * Should raise NotFoundStoreError if room not found
   * Should raise StateStoreError if room/game is not in the right state
   *
   * TODO: We could add an expectation that the answer of this pid does not
   * yet exist (and simplify answerQuestion.websocket)
   */
  addAnswer: (addAnswer: {
    roomId: string;
    pid: string;
    answer: string;
  }) => Promise<Room>;
}

export class StoreError extends Error {}
export class NotFoundStoreError extends StoreError {}
export class ExistsStoreError extends StoreError {}
export class StateStoreError extends StoreError {}
