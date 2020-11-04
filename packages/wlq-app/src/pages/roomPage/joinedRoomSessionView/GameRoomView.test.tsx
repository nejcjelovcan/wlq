import { render } from "@testing-library/react";
import {
  gameFixture,
  gameStateQuestionFixture,
  posedQuestionFixture
} from "@wlq/wlq-core/lib/model/fixtures";
import { getGamePublic } from "@wlq/wlq-core/lib/model/game/Game";
import React from "react";
import GameRoomView from "./GameRoomView";

describe("GameRoomView", () => {
  it("renders column flex", async () => {
    const { getByTestId } = render(
      <GameRoomView
        game={getGamePublic(gameFixture())}
        pid={"pid"}
        participants={[]}
        answerQuestion={() => {}}
      />
    );
    expect(getByTestId("ColumnFlex")).toBeVisible();
  });
  it("renders question if state=Question", async () => {
    const { getByText } = render(
      <GameRoomView
        game={getGamePublic(
          gameStateQuestionFixture({
            question: posedQuestionFixture({ questionText: "Question text?" })
          })
        )}
        pid={"pid"}
        participants={[]}
        answerQuestion={() => {}}
      />
    );
    expect(getByText("Question text?")).toBeVisible();
  });
  it("renders question if state=Answer", async () => {
    const { getByText } = render(
      <GameRoomView
        game={getGamePublic(
          gameStateQuestionFixture({
            question: posedQuestionFixture({ questionText: "Question text?" })
          })
        )}
        pid={"pid"}
        participants={[]}
        answerQuestion={() => {}}
      />
    );
    expect(getByText("Question text?")).toBeVisible();
  });
});
