import shakeOffCollection from '../shakeOffCollection'

import {
  collectionFixture,
  collectionItemFixture,
  questionFixture,
} from './collection.fixtures'

describe('shakeOffCollection', () => {
  it('truncates question array if itemLength is less than a minimal amount', () => {
    const collection = collectionFixture({
      items: [
        collectionItemFixture(),
        collectionItemFixture(),
        collectionItemFixture(),
      ],
      questions: [questionFixture()],
    })
    expect(shakeOffCollection(collection, 3).questions.length).toBe(1)
    expect(shakeOffCollection(collection, 10).questions.length).toBe(0)
  })
})
