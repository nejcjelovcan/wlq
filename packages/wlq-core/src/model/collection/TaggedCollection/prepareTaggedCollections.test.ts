import { TaggedCollection } from "..";
import prepareTaggedCollections from "./prepareTaggedCollections";

import {
  taggedCollectionFixture,
  taggedCollectionItemFixture,
  taggedQuestionFixture
} from "./__fixtures__/taggedCollection.fixtures";

const customCollectionFixture = (props: Partial<TaggedCollection> = {}) =>
  taggedCollectionFixture({
    items: [
      taggedCollectionItemFixture({
        tags: ["a", "b"],
        sets: ["europe", "asia"]
      }),
      taggedCollectionItemFixture({ tags: ["a"], sets: ["asia", "america"] }),
      taggedCollectionItemFixture({ tags: ["c"], sets: ["oceania"] })
    ],
    questions: [
      taggedQuestionFixture({ type: "TaggedPositive" }),
      taggedQuestionFixture({ type: "TaggedNegative" })
    ],
    ...props
  });

describe("prepareTaggedCollections", () => {
  it("does not remove collections or questions if sets array is empty", () => {
    // it will still fill questions' possibleTags, so it does not return
    // identical collections
    const collection = customCollectionFixture();
    const prepared = prepareTaggedCollections({
      collections: [collection],
      minItems: 1,
      minNegativeQuestionTagItems: 1
    });
    expect(prepared.length).toBe(1);
    expect(prepared[0].questions.length).toBe(2);
  });

  it("removes items without a given set", () => {
    const collection = customCollectionFixture();

    expect(
      prepareTaggedCollections({
        collections: [collection],
        sets: ["asia"],
        minItems: 1,
        minNegativeQuestionTagItems: 1
      })[0].items.length
    ).toBe(2);
  });

  it("removes questions without tags", () => {
    const collection = customCollectionFixture();

    expect(
      prepareTaggedCollections({
        collections: [collection],
        sets: ["asia"],
        minItems: 2,
        minNegativeQuestionTagItems: 3
      })[0].questions.length
    ).toBe(1);
  });

  it("removes collections without questions", () => {
    const collection = customCollectionFixture();

    expect(
      prepareTaggedCollections({
        collections: [collection],
        sets: ["asia"],
        minItems: 3,
        minNegativeQuestionTagItems: 3
      })
    ).toEqual([]);
  });
});
