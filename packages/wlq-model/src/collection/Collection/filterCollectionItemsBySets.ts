import Collection from '.'

const filterCollectionItemsBySets = <C extends Collection = Collection>(
  collection: C,
  sets: string[],
): C => {
  if (sets.length === 0) return collection
  return {
    ...collection,
    items: collection.items.filter(
      item => item.sets.filter(set => sets.includes(set)).length > 0,
    ),
  }
}

export default filterCollectionItemsBySets
