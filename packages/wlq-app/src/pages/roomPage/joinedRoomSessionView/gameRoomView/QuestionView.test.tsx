import { render } from "@testing-library/react";
import {
  posedQuestionFixture,
  userDetailsFixture
} from "@wlq/wlq-core/lib/model/fixtures";
import { createOvermindMock } from "overmind";
import { Provider } from "overmind-react";
import React from "react";
import UserDetailsContext from "../../../../contexts/UserDetailsContext";
import { config } from "../../../../overmind";
import QuestionView from "./QuestionView";

describe("QuestionView", () => {
  it("displays questionText and options when current=Question", () => {
    const { getByText } = render(
      <Provider value={createOvermindMock(config)}>
        <QuestionView
          current="Question"
          question={posedQuestionFixture({
            questionText: "Question text",
            options: ["Option 1", "Option 2"]
          })}
          participantsByAnswer={{}}
        />
      </Provider>
    );
    expect(getByText("Question text")).toBeInTheDocument();
    expect(getByText("Option 1")).toBeInTheDocument();
    expect(getByText("Option 2")).toBeInTheDocument();
  });
  it("displays question text when current=Answer", () => {
    const { getByText } = render(
      <Provider value={createOvermindMock(config)}>
        <UserDetailsContext.Provider value={userDetailsFixture()}>
          <QuestionView
            current="Answer"
            question={posedQuestionFixture({
              questionText: "Question text",
              options: ["Option 1", "Option 2"]
            })}
            userAnswer="Option 1"
            participantsByAnswer={{}}
          />
        </UserDetailsContext.Provider>
      </Provider>
    );
    expect(getByText("Question text")).toBeInTheDocument();
  });
});
