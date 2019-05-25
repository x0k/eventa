import { buildIterator } from '../iterator'

test('Simple iterator', () => {
  const begin = new Date(2001, 0, 1, 1, 0)
  const end = new Date(2001, 0, 3, 3, 11)
  const iterator = buildIterator(begin, end, {
    minute: {
      step: 30,
      expression: [ "$>>", "@get", ["minute"], '@not', [ '@equal', [ 30 ] ] ]
    },
    hour: {
      step: 12
    }
  })
  const items = [...iterator]
  expect(items).toEqual([
    { minute: 0, hour: 1, day: 1, month: 0, year: 2001 },
    { minute: 0, hour: 13, day: 1, month: 0, year: 2001 },
    { minute: 0, hour: 1, day: 2, month: 0, year: 2001 },
    { minute: 0, hour: 13, day: 2, month: 0, year: 2001 },
    { minute: 0, hour: 1, day: 3, month: 0, year: 2001 }
  ])
})