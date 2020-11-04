import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { requestMachine } from "../../overmind/request.statemachine";
import RoomCreationForm from "./RoomCreationForm";

describe("RoomCreationForm", () => {
  it("calls updateNewRoom when Listed switch is clicked", () => {
    const updateNewRoom = jest.fn();
    const { getByLabelText } = render(
      <RoomCreationForm
        newRoom={{ listed: true }}
        request={requestMachine.create({ current: "Init" })}
        updateNewRoom={updateNewRoom}
        submitNewRoom={() => {}}
      />
    );

    fireEvent.click(getByLabelText("Listed"));
    expect(updateNewRoom.mock.calls.length).toBe(1);
    expect(updateNewRoom.mock.calls[0][0]).toStrictEqual({ listed: false });
  });
  it("calls submitNewRoom when Continue button is clicked", () => {
    const submitNewRoom = jest.fn();
    const { getByRole } = render(
      <RoomCreationForm
        newRoom={{ listed: true }}
        request={requestMachine.create({ current: "Init" })}
        updateNewRoom={() => {}}
        submitNewRoom={submitNewRoom}
      />
    );

    fireEvent.click(getByRole("button", { name: "Continue" }));
    expect(submitNewRoom.mock.calls.length).toBe(1);
  });
});
