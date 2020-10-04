import poseTaggedQuestion from '../poseTaggedQuestion'
import { taggedCollectionFixture } from '../../TaggedCollection/__tests__/taggedCollection.fixtures'

describe('poseTaggedQuestion', () => {
  it('returns posed question with 4 options for a given collection', () => {
    const posed = poseTaggedQuestion(
      taggedCollectionFixture({
        questions: [
          {
            type: 'TaggedPositive',
            questionTextTemplate: 'Example question text',
          },
        ],
      }),
    )
    expect(posed).toMatchObject({ questionText: 'Example question text' })
    expect(posed.options.length).toBe(4)
  })
})
