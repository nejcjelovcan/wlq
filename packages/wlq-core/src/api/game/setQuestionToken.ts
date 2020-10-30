import * as t from "io-ts";
import { decodeThrow, IStore } from "../..";

export default async function setGameQuestionToken(
  event: { [key: string]: unknown },
  store: Pick<IStore, "setGameQuestionToken">
) {
  const { roomId, questionToken } = decodeThrow(
    SetQuestionTokenEventCodec,
    event
  );

  await store.setGameQuestionToken({ roomId }, questionToken);
}

export const SetQuestionTokenEventCodec = t.type({
  roomId: t.string,
  questionToken: t.string
});
export type SetQuestionTokenEvent = t.TypeOf<typeof SetQuestionTokenEventCodec>;
