import React from "react";
import PageHead from "./PageHead";
import { render } from "@testing-library/react";
import { UserDetails } from "@wlq/wlq-core/lib/model";

const userDetails: UserDetails = {
  type: "UserDetails",
  emoji: "🐭",
  color: "red",
  alias: "Alias"
};

describe("PageHead", () => {
  it("Displays title as text", () => {
    const { getByText } = render(<PageHead title="Title" />);
    expect(getByText("Title")).toBeInTheDocument();
  });
  it("Displays user details emoji if userDetails provided", () => {
    const { getByText } = render(
      <PageHead title="Title" userDetails={userDetails} />
    );
    expect(getByText("🐭")).toBeInTheDocument();
  });
  it("Displays alias if userDetails provided", () => {
    const { getByText } = render(
      <PageHead title="Title" userDetails={userDetails} showAlias />
    );
    expect(getByText("Alias")).toBeInTheDocument();
  });
  it("Does not display alias if userDetails provided and showAlias=false", () => {
    const { baseElement } = render(
      <PageHead title="Title" userDetails={userDetails} showAlias={false} />
    );
    expect(baseElement).not.toContain("Alias");
  });
});
