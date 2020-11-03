import { fireEvent, render } from "@testing-library/react";
import { userDetailsFixture } from "@wlq/wlq-core/lib/model/fixtures";
import React from "react";
import UserDetailsForm from "./UserDetailsForm";

describe("UserDetailsForm", () => {
  it("has Save button disabled if state is not Valid", () => {
    const { getByRole } = render(
      <UserDetailsForm
        current="Partial"
        details={{}}
        updateDetails={() => {}}
        onDone={() => {}}
      />
    );

    expect(getByRole("button", { name: "Save" })).toBeDisabled();
  });
  it("calls onDone when Save is pressed and state is Valid", () => {
    const onDone = jest.fn();
    const { getByRole } = render(
      <UserDetailsForm
        current="Valid"
        details={userDetailsFixture()}
        updateDetails={() => {}}
        onDone={onDone}
      />
    );

    fireEvent.click(getByRole("button", { name: "Save" }));
    expect(onDone.mock.calls.length).toBe(1);
  });
  it("calls updateDetails with new alias when alias input is changed", () => {
    const updateDetails = jest.fn();
    const { getByLabelText } = render(
      <UserDetailsForm
        current="Partial"
        details={{}}
        updateDetails={updateDetails}
        onDone={() => {}}
      />
    );

    fireEvent.change(getByLabelText("Nickname"), {
      target: { value: "New alias" }
    });
    expect(updateDetails.mock.calls.length).toBe(1);
    expect(updateDetails.mock.calls[0][0]).toStrictEqual({
      alias: "New alias"
    });
  });
  it("calls updateDetails with new emoji when emoji button is clicked", () => {
    const updateDetails = jest.fn();
    const { getByRole } = render(
      <UserDetailsForm
        current="Partial"
        details={{}}
        updateDetails={updateDetails}
        onDone={() => {}}
      />
    );

    fireEvent.click(getByRole("button", { name: "🐮" }));
    expect(updateDetails.mock.calls.length).toBe(1);
    expect(updateDetails.mock.calls[0][0]).toStrictEqual({ emoji: "🐮" });
  });
  it("calls updateDetails with new color when color button is clicked", () => {
    const updateDetails = jest.fn();
    const { getByLabelText } = render(
      <UserDetailsForm
        current="Partial"
        details={{}}
        updateDetails={updateDetails}
        onDone={() => {}}
      />
    );

    fireEvent.click(getByLabelText("Color blue"));
    expect(updateDetails.mock.calls.length).toBe(1);
    expect(updateDetails.mock.calls[0][0]).toStrictEqual({ color: "blue" });
  });
});
