import uniqueBy from '../uniqueBy.helper'

describe('uniqueBy', () => {
  it('uniques array of object by a key', () => {
    expect(uniqueBy([{ a: 1 }, { a: 2 }, { a: 1 }, { a: 3 }], 'a')).toEqual([
      { a: 1 },
      { a: 2 },
      { a: 3 },
    ])
  })
})
