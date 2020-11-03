import React from "react";
import ColorPicker from "./ColorPicker";
import { fireEvent, render } from "@testing-library/react";
import { USER_DETAILS_COLORS } from "@wlq/wlq-core/lib/model";

describe("ColorPicker", () => {
  it("displays color buttons", () => {
    const { getAllByRole } = render(<ColorPicker setColor={() => {}} />);
    expect(getAllByRole("button").length).toBe(USER_DETAILS_COLORS.length);
  });
  it("selects color that was passed", () => {
    const { getByLabelText } = render(
      <ColorPicker setColor={() => {}} color="blue" />
    );
    expect(getByLabelText("Color blue")).toHaveTextContent("•");
  });
  it("calls setColor when button is clicked", () => {
    const setColor = jest.fn();
    const { getByLabelText } = render(
      <ColorPicker setColor={setColor} color="blue" />
    );
    fireEvent.click(getByLabelText("Color blue"));
    expect(setColor.mock.calls.length).toBe(1);
    expect(setColor.mock.calls[0]).toEqual(["blue"]);
  });
});
