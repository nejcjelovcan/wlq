import { gameFixture, roomFixture } from "../../model/fixtures";
import IStore, {
  NotFoundStoreError,
  StateStoreError
} from "../../model/IStore";
import { newMemoryStore } from "../../model/MemoryStore";
import { IoValidationError } from "../../model/model.errors";
import setQuestionToken from "./setQuestionToken";

describe("setQuestionToken", () => {
  it("throws IoValidationError if payload is not valid", async () => {
    const store = newMemoryStore();

    await expect(
      setQuestionToken({ roomId: "roomId" }, store)
    ).rejects.toThrowError(IoValidationError);
  });
  it("throws NotFoundStoreError if room does not exist", async () => {
    const store = newMemoryStore();

    await expect(
      setQuestionToken(
        { roomId: "roomId", questionToken: "questionToken" },
        store
      )
    ).rejects.toThrowError(NotFoundStoreError);
  });
  it("throws StateStoreError if room is not in state=Game", async () => {
    const store = newMemoryStore();
    await store.addRoom(roomFixture({ roomId: "roomId" }));

    await expect(
      setQuestionToken(
        { roomId: "roomId", questionToken: "questionToken" },
        store
      )
    ).rejects.toThrowError(StateStoreError);
  });

  it("calls store.setQuestionToken", async () => {
    const storeSetGameQuestionToken = jest.fn();
    const store: IStore = {
      ...newMemoryStore(),
      setGameQuestionToken: storeSetGameQuestionToken
    };
    await store.addRoom(
      roomFixture({
        current: "Game",
        game: gameFixture({ current: "Question" })
      })
    );

    await setQuestionToken(
      { roomId: "roomId", questionToken: "questionToken" },
      store
    );

    const calls = storeSetGameQuestionToken.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toStrictEqual({ roomId: "roomId" });
    expect(calls[0][1]).toBe("questionToken");
  });
});
