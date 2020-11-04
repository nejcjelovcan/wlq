import { render } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import CountdownProgress from "./CountdownProgress";

describe("CountdownProgress", () => {
  it("displays hidden progress if visible=false", () => {
    const { getByTestId } = render(<CountdownProgress visible={false} />);
    expect(getByTestId("progress")).not.toBeVisible();
  });
  it("displays visible progress if visible=true", () => {
    const { getByTestId } = render(<CountdownProgress visible />);
    expect(getByTestId("progress")).toBeVisible();
  });
  it("counts down", async () => {
    const { getByText } = render(<CountdownProgress visible time={15} />);
    expect(getByText("15")).toBeVisible();

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1001));
    });

    expect(getByText("14")).toBeVisible();
  });
});
