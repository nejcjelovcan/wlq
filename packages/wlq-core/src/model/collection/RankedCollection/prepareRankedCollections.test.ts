import prepareRankedCollections from "./prepareRankedCollections";
import { rankedCollectionFixture } from "./__fixtures__/rankedCollection.fixtures";

describe("prepareRankedCollections", () => {
  it("does not remove collections or questions if sets array is empty", () => {
    const collection = rankedCollectionFixture();
    const prepared = prepareRankedCollections({
      collections: [collection],
      minItems: 1,
      sets: []
    });
    expect(prepared.length).toBe(1);
    expect(prepared[0].questions.length).toBe(2);

    const prepared2 = prepareRankedCollections({
      collections: [collection],
      minItems: 1
    });
    expect(prepared2.length).toBe(1);
    expect(prepared2[0].questions.length).toBe(2);
  });
});
