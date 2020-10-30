import * as t from "io-ts";
import { PosedQuestionPublicCodec } from "../../model/game/PosedQuestion";

export const PoseQuestionMessageCodec = t.type({
  action: t.literal("poseQuestion"),
  data: t.type({
    question: PosedQuestionPublicCodec
  })
});
export type PoseQuestionMessage = t.TypeOf<typeof PoseQuestionMessageCodec>;
