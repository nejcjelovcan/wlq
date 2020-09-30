import getTaggedCollectionInfo from '../getTaggedCollectionInfo'

import {
  taggedCollectionFixture,
  taggedCollectionItemFixture,
} from './taggedCollection.fixtures'

describe('getTaggedCollectionInfo', () => {
  it('counts tags in all items', () => {
    const collection = taggedCollectionFixture({
      items: [
        taggedCollectionItemFixture({ tags: ['a', 'b'] }),
        taggedCollectionItemFixture({ tags: ['a'] }),
        taggedCollectionItemFixture({ tags: ['c'] }),
      ],
    })
    expect(getTaggedCollectionInfo(collection).tagLengths).toEqual({
      a: 2,
      b: 1,
      c: 1,
    })

    const emptyCollection = taggedCollectionFixture({ items: [] })
    expect(getTaggedCollectionInfo(emptyCollection).tagLengths).toEqual({})
  })

  it('generates a set of all tags', () => {
    const collection = taggedCollectionFixture({
      items: [
        taggedCollectionItemFixture({ tags: ['a', 'b'] }),
        taggedCollectionItemFixture({ tags: ['a'] }),
        taggedCollectionItemFixture({ tags: ['c'] }),
      ],
    })

    expect(getTaggedCollectionInfo(collection).tags).toEqual(['a', 'b', 'c'])

    const emptyCollection = taggedCollectionFixture({ items: [] })
    expect(getTaggedCollectionInfo(emptyCollection).tags).toEqual([])
  })
})
