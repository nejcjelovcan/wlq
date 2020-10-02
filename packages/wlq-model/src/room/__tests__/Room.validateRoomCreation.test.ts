import { validateRoomCreation } from '../Room'

describe('validateRoomCreation', () => {
  it('raises error if no name provided', () => {
    expect(() => validateRoomCreation({})).toThrow('Room name must be')
  })
  it('raises error if name too short', () => {
    expect(() => validateRoomCreation({ name: '' })).toThrow(
      'Room name must be',
    )
  })
  it('raises error if name too long', () => {
    expect(() =>
      validateRoomCreation({
        name:
          'aVeryLongNameThatBreaksAnyInterfaceThatIsNotSpecificallyMadeForGermanicLevelCompoundWords',
      }),
    ).toThrow('Room name must be')
  })
  it('does not raise an error if name between 1 and 30 chars', () => {
    expect(
      validateRoomCreation({
        name: 'A',
      }),
    ).toMatchObject({ name: 'A' })
    expect(
      validateRoomCreation({
        name: 'aVeryLongNameThatBreaksAnyInte',
      }),
    ).toMatchObject({ name: 'aVeryLongNameThatBreaksAnyInte' })
  })
  it('sets listed=true by default', () => {})
})
