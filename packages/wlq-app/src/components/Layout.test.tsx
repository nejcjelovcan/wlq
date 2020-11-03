import { render } from "@testing-library/react";
import React from "react";
import Layout from "./Layout";

describe("Layout", () => {
  it("has height=100vh in css", () => {
    const { getByTestId } = render(<Layout>Text</Layout>);

    expect(getByTestId("layout")).toHaveStyle("height: 100vh;");
  });
});
