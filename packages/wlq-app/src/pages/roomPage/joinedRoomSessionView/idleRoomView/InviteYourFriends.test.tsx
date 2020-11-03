import React from "react";
import { render, fireEvent } from "@testing-library/react";
import InviteYourFiends from "./InviteYourFriends";

describe("InviteYourFriends", () => {
  it("Displays input with url", () => {
    const { getByRole } = render(<InviteYourFiends />);
    const input = getByRole("textbox");
    expect(input).toBeVisible();
    expect(input).toHaveAttribute("value", "http://localhost/");
  });

  it("Displays text property", () => {
    const { getByText } = render(
      <InviteYourFiends text="Whatever text is passed" />
    );

    expect(getByText(/Whatever text is passed/)).toBeVisible();
  });

  it("Does not change value of the input field (readonly)", () => {
    const { getByRole } = render(<InviteYourFiends />);
    const input = getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    expect(input).toHaveAttribute("value", "http://localhost/");
  });

  it("Triggers document.execCommand('copy') upon clicking", () => {
    const execCommand = jest.fn();
    global.document.execCommand = execCommand;
    const { getByRole } = render(<InviteYourFiends />);
    const input = getByRole("textbox");
    fireEvent.click(input);
    expect(execCommand.mock.calls.length).toBe(1);
    expect(execCommand.mock.calls[0]).toEqual(["copy"]);
  });

  it("Shows toast upon clicking", () => {
    const execCommand = jest.fn();
    global.document.execCommand = execCommand;
    const { getByRole, queryAllByRole } = render(<InviteYourFiends />);

    fireEvent.click(getByRole("textbox"));
    const [alertTitle, alertContent] = queryAllByRole("alert");
    expect(alertTitle).toBeInTheDocument();
    expect(alertContent).toBeInTheDocument();
    expect(alertTitle).toHaveTextContent("Link copied!");
  });
});
