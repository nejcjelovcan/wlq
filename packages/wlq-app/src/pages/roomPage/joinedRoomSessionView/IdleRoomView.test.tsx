import { fireEvent, render } from "@testing-library/react";
import { participantPublicFixture } from "@wlq/wlq-core/lib/model/fixtures";
import React from "react";
import IdleRoomView from "./IdleRoomView";

describe("IdleRoomView", () => {
  it("has visible start game button", async () => {
    const { getByRole } = render(
      <IdleRoomView startGame={() => {}} participants={[]} />
    );
    expect(getByRole("button", { name: "Start game" })).toBeVisible();
  });
  it("clicking start game button calls startGame callback", async () => {
    const startGame = jest.fn();
    const { getByRole } = render(
      <IdleRoomView startGame={startGame} participants={[]} />
    );
    fireEvent.click(getByRole("button", { name: "Start game" }));
    expect(startGame.mock.calls.length).toBe(1);
  });
  it("has text 'no one here' if there are no participants", async () => {
    const { getByText } = render(
      <IdleRoomView startGame={() => {}} participants={[]} />
    );
    expect(getByText(/no one here/)).toBeVisible();
  });
  it("does not have text 'no one here' if there are participants", async () => {
    const { queryByText } = render(
      <IdleRoomView
        startGame={() => {}}
        participants={[participantPublicFixture()]}
      />
    );
    expect(queryByText(/no one here/)).not.toBeInTheDocument();
  });
});
