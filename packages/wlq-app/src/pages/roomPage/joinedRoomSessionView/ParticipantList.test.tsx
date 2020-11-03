import { render } from "@testing-library/react";
import {
  gameStateQuestionFixture,
  participantPublicFixture,
  userDetailsFixture
} from "@wlq/wlq-core/lib/model/fixtures";
import { getGamePublic } from "@wlq/wlq-core/lib/model/game/Game";
import React from "react";
import ParticipantList from "./ParticipantList";

describe("ParticipantList", () => {
  it("displays list of participants", () => {
    const { getByText } = render(
      <ParticipantList
        participants={[
          participantPublicFixture({
            details: userDetailsFixture({ alias: "Alias 1" })
          }),
          participantPublicFixture({
            details: userDetailsFixture({ alias: "Alias 2" })
          })
        ]}
      />
    );
    expect(getByText("Alias 1")).toBeInTheDocument();
    expect(getByText("Alias 2")).toBeInTheDocument();
  });
  it("displays list of participants in Question mode (greyscale if not answered)", () => {
    const { getByTestId } = render(
      <ParticipantList
        game={{
          ...getGamePublic(gameStateQuestionFixture()),
          // @ts-ignore
          answeredParticipants: ["pid2"]
        }}
        participants={[
          participantPublicFixture({
            details: userDetailsFixture({ alias: "Alias 1" }),
            pid: "pid1"
          }),
          participantPublicFixture({
            details: userDetailsFixture({ alias: "Alias 2" }),
            pid: "pid2"
          })
        ]}
      />
    );
    expect(getByTestId("pid1")).toBeInTheDocument();
    expect(getByTestId("pid1")).toHaveStyle("filter: grayscale(100%);");
    expect(getByTestId("pid2")).toBeInTheDocument();
    expect(getByTestId("pid2")).not.toHaveStyle("filter: grayscale(100%);");
  });
});
