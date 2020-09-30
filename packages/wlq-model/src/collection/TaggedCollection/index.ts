import Collection, { CollectionItem } from '../Collection'
import Question from '../Question'

export default interface TaggedCollection
  extends Collection<TaggedCollectionItem> {
  type: 'TaggedCollection'
  questions: TaggedCollectionQuestion[]
}

export interface TaggedCollectionItem extends CollectionItem {
  type: 'TaggedCollectionItem'
  tags: string[]
}

export interface TaggedCollectionQuestion extends Question {
  type: 'TaggedNegative' | 'TaggedPositive'
  possibleTags?: string[]
}

export interface TaggedCollectionInfo {
  tagLengths: { [tag: string]: number }
  tags: string[]
}

export { default as getTaggedCollectionInfo } from './getTaggedCollectionInfo'
export { default as prepareTaggedCollections } from './prepareTaggedCollections'
export { default as shakeOffTaggedCollection } from './shakeOffTaggedCollection'
