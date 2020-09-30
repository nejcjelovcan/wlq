import getCollectionInfo from '../getCollectionInfo'

import { collectionFixture } from './collection.fixtures'

describe('getCollectionInfo', () => {
  it('returns length of collection items as itemsLength', () => {
    const collection = collectionFixture({
      items: [
        { type: 'CollectionItem', name: 'Test', sets: [] },
        { type: 'CollectionItem', name: 'Test2', sets: [] },
      ],
    })
    expect(getCollectionInfo(collection).itemsLength).toBe(2)

    const emptyCollection = collectionFixture({ items: [] })
    expect(getCollectionInfo(emptyCollection).itemsLength).toBe(0)
  })
})
