import TaggedCollection from '..'
import shakeOffTaggedCollection from '../shakeOffTaggedCollection'

import {
  taggedCollectionFixture,
  taggedCollectionItemFixture,
  taggedQuestionFixture,
} from './taggedCollection.fixtures'

const customCollectionFixture = (props: Partial<TaggedCollection> = {}) =>
  taggedCollectionFixture({
    items: [
      taggedCollectionItemFixture({ tags: ['a', 'b'] }),
      taggedCollectionItemFixture({ tags: ['a'] }),
      taggedCollectionItemFixture({ tags: ['c'] }),
      taggedCollectionItemFixture({ tags: [] }), // TODO
    ],
    ...props,
  })

describe('shakeOffTaggedCollection', () => {
  it('sets .possibleTags on TaggedPositive question', () => {
    const collection = customCollectionFixture({
      questions: [taggedQuestionFixture({ type: 'TaggedPositive' })],
    })

    // as long as there's one item with a tag, TaggedPositive will have that tag
    // in possibleTags (no matter how many there are)
    expect(
      shakeOffTaggedCollection(collection, 3).questions[0].possibleTags,
    ).toEqual(['a', 'b', 'c'])
    expect(
      shakeOffTaggedCollection(collection, 0).questions[0].possibleTags,
    ).toEqual(['a', 'b', 'c'])
    expect(
      shakeOffTaggedCollection(collection, 100).questions[0].possibleTags,
    ).toEqual(['a', 'b', 'c'])
  })

  it('sets .possibleTags on TaggedNegative question', () => {
    const collection = customCollectionFixture({
      questions: [taggedQuestionFixture({ type: 'TaggedNegative' })],
    })

    // we have 2 items with 'a' tag (other tags are only on 1 item)
    expect(
      shakeOffTaggedCollection(collection, 2).questions[0].possibleTags,
    ).toEqual(['a'])
  })

  it('removes TaggedNegative questions with no possible tags', () => {
    const collection = customCollectionFixture({
      questions: [taggedQuestionFixture({ type: 'TaggedNegative' })],
    })

    // we have 2 items with 'a' tag (other tags are only on 1 item)
    expect(shakeOffTaggedCollection(collection, 3).questions).toEqual([])
    expect(
      shakeOffTaggedCollection(collection, 0).questions[0].possibleTags,
    ).toEqual(['a', 'b', 'c'])
  })
})
