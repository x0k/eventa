import { wrapIterable, restrictIterable, filterIterable, reduceIterable } from '../index'

interface IDictionary<T> {
  [key: string]: T
}

interface IYears extends IDictionary<number> {
  year: number
}

interface IMonths extends IYears {
  month: number,
  monthMilliseconds: number
}

interface IDate extends IMonths {
  date: number
  dateMilliseconds: number
  day: number
}

interface IHours extends IDate {
  hour: number
  hourMilliseconds: number
}

interface IMinutes extends IHours {
  minute: number,
  milliseconds: number
}

type TIncrementor = (value: number) => number

type TGenerator<T> = (incrementor: TIncrementor) => (data: T) => IterableIterator<T>

interface IConstraint {
  step?: number
}

const dayMilliseconds = 86400000
const hourMilliseconds = 3600000
const minuteMilliseconds = 60000

function getMonthLength (year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function withConstraints<T>(generator: TGenerator<T>, constraint: IConstraint = {}) {
  const { step = 1 } = constraint
  const incrementor = (value: number) => value + step
  return generator(incrementor)
}

function yearsIterator (incrementor: TIncrementor) {
  return function * ({ year }: IYears) {
    let value = year
    while (true) {
      yield { year: value }
      value = incrementor(value)
    }
  }
}

function monthsIterator(incrementor: TIncrementor) {
  return function * ({ year, month }: IMonths) {
    let value = month
    let ms = new Date(year, value).getTime()
    while (value < 12) {
      yield { month: value, year, monthMilliseconds: ms }
      value = incrementor(value)
      ms = new Date(year, value).getTime()
    }
    return { month: value % 12, year, monthMilliseconds: ms }
  }
}

function dateIterator(incrementor: TIncrementor) {
  return function * ({ date, ...rest }: IDate) {
    const { year, month, monthMilliseconds } = rest
    const len = getMonthLength(year, month)
    let dateValue = date
    let dayValue = new Date(rest.year, rest.month, date).getDay()
    let ms = monthMilliseconds + (date -1) * dayMilliseconds
    while (dateValue <= len) {
      yield { ...rest, day: dayValue, date: dateValue, dateMilliseconds: ms }
      const next = incrementor(dateValue)
      const diff = next - dateValue
      dayValue = (dayValue + diff) % 7
      ms += diff * dayMilliseconds
      dateValue = next
    }
    return { ...rest, day: dayValue, date: date % len + 1, dateMilliseconds: ms }
  }
}

function hoursIterator(incrementor: TIncrementor) {
  return function * ({ hour, dateMilliseconds, ...rest }: IHours) {
    let value = hour
    let ms = dateMilliseconds + hour * hourMilliseconds
    while (value < 24) {
      yield { ...rest, hour: value, hourMilliseconds: ms, dateMilliseconds }
      const next = incrementor(value)
      ms += (next - value) * hourMilliseconds
      value = next
    }
    return { ...rest, hour: value % 24, hourMilliseconds: ms, dateMilliseconds }
  }
}

function minutesIterator(incrementor: TIncrementor) {
  return function * ({ minute, hourMilliseconds, ...rest }: IMinutes) {
    let value = minute
    let ms = hourMilliseconds + minute * minuteMilliseconds
    while (value < 60) {
      yield { ...rest, minute: value, milliseconds: ms, hourMilliseconds }
      const next = incrementor(value)
      ms += (next - value) * minuteMilliseconds
      value = next
    }
    return { ...rest, minute: value % 60, milliseconds: ms, hourMilliseconds }
  }
}

test('Increase year', () => {

  const start = new Date(2000, 11, 31, 23, 48)
  const end = new Date(2001, 0, 1, 0, 20)

  const condition = ({ milliseconds }: IMinutes) => milliseconds < end.getTime()

  const year = { year: start.getFullYear() }
  const month = { month: start.getMonth(), monthMilliseconds: 0, ...year }
  const date = { date: start.getDate(), day: start.getDay(), dateMilliseconds: 0, ...month }
  const hour = { hour: start.getHours(), hourMilliseconds: 0, ...date }
  const minute = { minute: start.getMinutes(), milliseconds: 0, ...hour }

  const years = withConstraints(yearsIterator)(year)
  const months = wrapIterable(years, withConstraints(monthsIterator), month)
  const dates = wrapIterable(months, withConstraints(dateIterator), date)
  const hours = wrapIterable(dates, withConstraints(hoursIterator), hour)
  const minutes = wrapIterable(hours, withConstraints(minutesIterator, { step: 10 }), minute)

  const dateTime = restrictIterable<IMinutes>(minutes, condition)

  const items = [
    { milliseconds: 978295680000, hour: 23, date: 31, day: 0, dateMilliseconds: 978210000000, month: 11, monthMilliseconds: 975618000000, year: 2000, minute: 48, hourMilliseconds: 978292800000 },
    { milliseconds: 978296280000, hour: 23, date: 31, day: 0, dateMilliseconds: 978210000000, month: 11, monthMilliseconds: 975618000000, year: 2000, minute: 58, hourMilliseconds: 978292800000 },
    { milliseconds: 978296880000, hour: 0, date: 1, day: 1, dateMilliseconds: 978296400000, month: 0, monthMilliseconds: 978296400000, year: 2001, minute: 8, hourMilliseconds: 978296400000 },
    { milliseconds: 978297480000, hour: 0, date: 1, day: 1, dateMilliseconds: 978296400000, month: 0, monthMilliseconds: 978296400000, year: 2001, minute: 18, hourMilliseconds: 978296400000 }
  ]

  expect([...dateTime]).toEqual(items)
})

function * generator (count: number) {
  for (let i = 0; i < count; i++) {
    yield i
  }
}

test('Filter iterable', () => {

  function filter (value: number) {
    return value % 2 === 0
  }

  const gen = filterIterable(generator(6), filter)
  expect([...gen]).toEqual([ 0, 2, 4 ])
})

test('Reduce iterable', () => {

  function separator (acc: number[]) {
    return acc.length < 4
  }
  
  function reducer (acc: number[], val: number) {
    return acc.concat(val)
  }

  const gen = generator(12)
  const reduced = reduceIterable(gen, separator, reducer, [])
  expect([...reduced]).toEqual([
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11]
  ])
})