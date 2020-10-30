import React from "react";
import UserBadge from "./UserBadge";
import { render } from "@testing-library/react";
import { userDetails } from "../__test__/fixtures";

describe("UserBadge", () => {
  it("Displays emoji", () => {
    const { getByText } = render(<UserBadge userDetails={userDetails} />);
    expect(getByText("🐭")).toBeInTheDocument();
  });
  it("Displays alias by default", () => {
    const { getByText } = render(<UserBadge userDetails={userDetails} />);
    expect(getByText("Alias")).toBeInTheDocument();
  });
  it("Does not display alias if showAlias=false", () => {
    const { baseElement } = render(
      <UserBadge userDetails={userDetails} showAlias={false} />
    );
    expect(baseElement).not.toContain("Alias");
  });
});
