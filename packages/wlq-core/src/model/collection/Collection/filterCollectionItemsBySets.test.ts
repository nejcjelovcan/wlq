import filterCollectionItemsBySets from "./filterCollectionItemsBySets";
import {
  collectionFixture,
  collectionItemFixture
} from "./__fixtures__/collection.fixtures";

describe("filterCollectionItemsBySets", () => {
  it("returns collection with items filtered by given sets", () => {
    const item1 = collectionItemFixture({ name: "Item 1", sets: ["set1"] });
    const item2 = collectionItemFixture({ name: "Item 2", sets: ["set2"] });
    const item3 = collectionItemFixture({
      name: "Item 3",
      sets: ["set1", "set2"]
    });
    const collection = collectionFixture({
      items: [item1, item2, item3]
    });

    expect(filterCollectionItemsBySets(collection, ["set1"]).items).toEqual([
      item1,
      item3
    ]);
  });

  it("returns the whole collection if given empty set array", () => {
    const collection = collectionFixture();
    const length = collection.items.length;

    expect(length).toBeGreaterThan(0); // a guard for changing .json file

    expect(filterCollectionItemsBySets(collection, []).items).toEqual(
      collection.items
    );
  });
});
