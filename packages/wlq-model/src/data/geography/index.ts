import {
  Collection,
  PosedQuestion,
  prepareRankedCollections,
  prepareTaggedCollections,
  RankedCollection,
  TaggedCollection,
} from '../../collection'
import taggedCollections from './geography.tagged.collections.json'
import rankedCollections from './geography.ranked.collections.json'
import { sample } from '../../helpers'
import poseRankedQuestion from '../../collection/Question/poseRankedQuestion'
import poseTaggedQuestion from '../../collection/Question/poseTaggedQuestion'

export const getAllCollections = (): Collection[] => [
  ...prepareTaggedCollections({
    collections: taggedCollections as TaggedCollection[],
  }),
  ...prepareRankedCollections({
    collections: rankedCollections as RankedCollection[],
  }),
]

export const poseQuestion = (collections: Collection[]): PosedQuestion => {
  const collection = sample(collections)
  switch (collection.type) {
    case 'RankedCollection':
      return poseRankedQuestion(collection as RankedCollection)

    case 'TaggedCollection':
      return poseTaggedQuestion(collection as TaggedCollection)
  }
}
