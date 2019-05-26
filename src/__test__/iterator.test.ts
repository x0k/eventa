import { buildIterator } from '../iterator'

test('Basic iterator', () => {
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
  const items = Array.from(iterator)
  expect(items).toEqual([
    { minute: 0, hour: 1, date: 1, day: 1, month: 0, year: 2001 },
    { minute: 0, hour: 13, date: 1, day: 1, month: 0, year: 2001 },
    { minute: 0, hour: 1, date: 2, day: 2, month: 0, year: 2001 },
    { minute: 0, hour: 13, date: 2, day: 2, month: 0, year: 2001 },
    { minute: 0, hour: 1, date: 3, day: 3, month: 0, year: 2001 }
  ])
})

test('Constraints', () => {
  const begin = new Date(2001, 0)
  const end = new Date(2011, 0)
  const iterator = buildIterator(begin, end, {
    minute: {
      step: 30,
    },
    hour: {
      step: 12
    },
    date: {
      step: 15,
    },
    month: {
      step: 6
    },
    year: {
      step: 3
    }
  })
  const items = Array.from(iterator)
  expect(items).toEqual([
    { minute: 0, hour: 0, day: 1, date: 1, month: 0, year: 2001 },
    { minute: 30, hour: 0, day: 1, date: 1, month: 0, year: 2001 },
    { minute: 0, hour: 12, day: 1, date: 1, month: 0, year: 2001 },
    { minute: 30, hour: 12, day: 1, date: 1, month: 0, year: 2001 },
    { minute: 0, hour: 0, day: 2, date: 16, month: 0, year: 2001 },
    { minute: 30, hour: 0, day: 2, date: 16, month: 0, year: 2001 },
    { minute: 0, hour: 12, day: 2, date: 16, month: 0, year: 2001 },
    { minute: 30, hour: 12, day: 2, date: 16, month: 0, year: 2001 },
    { minute: 0, hour: 0, day: 6, date: 0, month: 6, year: 2001 },
    { minute: 30, hour: 0, day: 6, date: 0, month: 6, year: 2001 },
    { minute: 0, hour: 12, day: 6, date: 0, month: 6, year: 2001 },
    { minute: 30, hour: 12, day: 6, date: 0, month: 6, year: 2001 },
    { minute: 0, hour: 0, day: 0, date: 15, month: 6, year: 2001 },
    { minute: 30, hour: 0, day: 0, date: 15, month: 6, year: 2001 },
    { minute: 0, hour: 12, day: 0, date: 15, month: 6, year: 2001 },
    { minute: 30, hour: 12, day: 0, date: 15, month: 6, year: 2001 },
    { minute: 0, hour: 0, day: 1, date: 30, month: 6, year: 2001 },
    { minute: 30, hour: 0, day: 1, date: 30, month: 6, year: 2001 },
    { minute: 0, hour: 12, day: 1, date: 30, month: 6, year: 2001 },
    { minute: 30, hour: 12, day: 1, date: 30, month: 6, year: 2001 },
    { minute: 0, hour: 0, day: 3, date: 14, month: 0, year: 2004 },
    { minute: 30, hour: 0, day: 3, date: 14, month: 0, year: 2004 },
    { minute: 0, hour: 12, day: 3, date: 14, month: 0, year: 2004 },
    { minute: 30, hour: 12, day: 3, date: 14, month: 0, year: 2004 },
    { minute: 0, hour: 0, day: 4, date: 29, month: 0, year: 2004 },
    { minute: 30, hour: 0, day: 4, date: 29, month: 0, year: 2004 },
    { minute: 0, hour: 12, day: 4, date: 29, month: 0, year: 2004 },
    { minute: 30, hour: 12, day: 4, date: 29, month: 0, year: 2004 },
    { minute: 0, hour: 0, day: 2, date: 13, month: 6, year: 2004 },
    { minute: 30, hour: 0, day: 2, date: 13, month: 6, year: 2004 },
    { minute: 0, hour: 12, day: 2, date: 13, month: 6, year: 2004 },
    { minute: 30, hour: 12, day: 2, date: 13, month: 6, year: 2004 },
    { minute: 0, hour: 0, day: 3, date: 28, month: 6, year: 2004 },
    { minute: 30, hour: 0, day: 3, date: 28, month: 6, year: 2004 },
    { minute: 0, hour: 12, day: 3, date: 28, month: 6, year: 2004 },
    { minute: 30, hour: 12, day: 3, date: 28, month: 6, year: 2004 },
    { minute: 0, hour: 0, day: 5, date: 12, month: 0, year: 2007 },
    { minute: 30, hour: 0, day: 5, date: 12, month: 0, year: 2007 },
    { minute: 0, hour: 12, day: 5, date: 12, month: 0, year: 2007 },
    { minute: 30, hour: 12, day: 5, date: 12, month: 0, year: 2007 },
    { minute: 0, hour: 0, day: 6, date: 27, month: 0, year: 2007 },
    { minute: 30, hour: 0, day: 6, date: 27, month: 0, year: 2007 },
    { minute: 0, hour: 12, day: 6, date: 27, month: 0, year: 2007 },
    { minute: 30, hour: 12, day: 6, date: 27, month: 0, year: 2007 },
    { minute: 0, hour: 0, day: 3, date: 11, month: 6, year: 2007 },
    { minute: 30, hour: 0, day: 3, date: 11, month: 6, year: 2007 },
    { minute: 0, hour: 12, day: 3, date: 11, month: 6, year: 2007 },
    { minute: 30, hour: 12, day: 3, date: 11, month: 6, year: 2007 },
    { minute: 0, hour: 0, day: 4, date: 26, month: 6, year: 2007 },
    { minute: 30, hour: 0, day: 4, date: 26, month: 6, year: 2007 },
    { minute: 0, hour: 12, day: 4, date: 26, month: 6, year: 2007 },
    { minute: 30, hour: 12, day: 4, date: 26, month: 6, year: 2007 },
    { minute: 0, hour: 0, day: 0, date: 10, month: 0, year: 2010 },
    { minute: 30, hour: 0, day: 0, date: 10, month: 0, year: 2010 },
    { minute: 0, hour: 12, day: 0, date: 10, month: 0, year: 2010 },
    { minute: 30, hour: 12, day: 0, date: 10, month: 0, year: 2010 },
    { minute: 0, hour: 0, day: 1, date: 25, month: 0, year: 2010 },
    { minute: 30, hour: 0, day: 1, date: 25, month: 0, year: 2010 },
    { minute: 0, hour: 12, day: 1, date: 25, month: 0, year: 2010 },
    { minute: 30, hour: 12, day: 1, date: 25, month: 0, year: 2010 },
    { minute: 0, hour: 0, day: 5, date: 9, month: 6, year: 2010 },
    { minute: 30, hour: 0, day: 5, date: 9, month: 6, year: 2010 },
    { minute: 0, hour: 12, day: 5, date: 9, month: 6, year: 2010 },
    { minute: 30, hour: 12, day: 5, date: 9, month: 6, year: 2010 },
    { minute: 0, hour: 0, day: 6, date: 24, month: 6, year: 2010 },
    { minute: 30, hour: 0, day: 6, date: 24, month: 6, year: 2010 },
    { minute: 0, hour: 12, day: 6, date: 24, month: 6, year: 2010 },
    { minute: 30, hour: 12, day: 6, date: 24, month: 6, year: 2010 }
  ])
})