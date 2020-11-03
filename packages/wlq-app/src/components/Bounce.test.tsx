import React from "react";
import Bounce from "./Bounce";
import { render } from "@testing-library/react";

describe("Bounce", () => {
  it("has animation defined in css if animate=true", () => {
    const { getByText } = render(<Bounce animate={true}>Text</Bounce>);
    expect(getByText("Text")).toHaveStyle("animation-duration: 1s;");
  });
  it("does not have animation defined in css if animate=false", () => {
    const { getByText } = render(<Bounce animate={false}>Text</Bounce>);
    expect(getByText("Text")).not.toHaveStyle("animation-duration: 1s;");
  });
});
