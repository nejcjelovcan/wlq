import React from "react";
import PageHead from "./PageHead";
import { render } from "@testing-library/react";
import { userDetailsFixture } from "@wlq/wlq-core/lib/model/fixtures";

describe("PageHead", () => {
  it("Displays title as text", () => {
    const { getByText } = render(<PageHead title="Title" />);
    expect(getByText("Title")).toBeInTheDocument();
  });
  it("Displays user details emoji if userDetails provided", () => {
    const { getByText } = render(
      <PageHead title="Title" userDetails={userDetailsFixture()} />
    );
    expect(getByText("🐭")).toBeInTheDocument();
  });
  it("Displays alias if userDetails provided", () => {
    const { getByText } = render(
      <PageHead title="Title" userDetails={userDetailsFixture()} showAlias />
    );
    expect(getByText("Alias")).toBeInTheDocument();
  });
  it("Does not display alias if userDetails provided and showAlias=false", () => {
    const { baseElement } = render(
      <PageHead
        title="Title"
        userDetails={userDetailsFixture()}
        showAlias={false}
      />
    );
    expect(baseElement).not.toContain("Alias");
  });
});
