import { wrapIterable, restrictIterable, filterIterable } from 'iterator-wrapper'

import { buildAction } from '../actionBuilder'

import { TExpression, TPredicate, IDictionary, isNumber, TValue } from '../utils'

import { IConstraint, IConstraints, YEAR, MONTH, DATE, DAY, HOUR, MINUTE } from '../utils/schedule'

import * as H from '../utils/dateTime'

interface IYears extends IDictionary<TValue> {
  [YEAR]: number
}

interface IMonths extends IYears {
  [MONTH]: number
  monthMilliseconds: number
}

interface IDate extends IMonths {
  [DATE]: number
  [DAY]: number
  dateMilliseconds: number
}

interface IHours extends IDate {
  [HOUR]: number
  hourMilliseconds: number
}

interface IMinutes extends IHours {
  [MINUTE]: number
  milliseconds: number
}

export { IMinutes as IDateTime }

function buildIncrementor(step: number | TExpression = 1): TIncrementor {
  return isNumber(step)
    ? (value: number) => value + step
    : buildAction(step)
}

function buildCondition<T>(expression?: TExpression): TPredicate<T> | null {
  return expression ? buildAction(expression) : null
}

type TIncrementor = (value: number) => number

type TGenerator<T> = (incrementor: TIncrementor) => (data: T) => IterableIterator<T>

function withConstraints<T>(generator: TGenerator<T>, constraint: IConstraint = {}) {
  const { step, expression } = constraint
  const incrementor = buildIncrementor(step)
  const condition = buildCondition(expression)
  const gen = generator(incrementor)
  return condition ? (data: T) => filterIterable(gen(data), condition) : gen
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
    const len = H.getMonthLength(year, month)
    let dateValue = date
    let dayValue = new Date(rest[YEAR], rest[MONTH], date).getDay()
    let ms = monthMilliseconds + (date -1) * H.day
    while (dateValue <= len) {
      yield { ...rest, day: dayValue, date: dateValue, dateMilliseconds: ms }
      const next = incrementor(dateValue)
      const diff = next - dateValue
      dayValue = (dayValue + diff) % 7
      ms += diff * H.day
      dateValue = next
    }
    return { ...rest, day: dayValue, date: date % len + 1, dateMilliseconds: ms }
  }
}

function hoursIterator(incrementor: TIncrementor) {
  return function * ({ hour, dateMilliseconds, ...rest }: IHours) {
    let value = hour
    let ms = dateMilliseconds + hour * H.hour
    while (value < 24) {
      yield { ...rest, hour: value, hourMilliseconds: ms, dateMilliseconds }
      const next = incrementor(value)
      ms += (next - value) * H.hour
      value = next
    }
    return { ...rest, hour: value % 24, hourMilliseconds: ms, dateMilliseconds }
  }
}

function minutesIterator(incrementor: TIncrementor) {
  return function * ({ minute, hourMilliseconds, ...rest }: IMinutes) {
    let value = minute
    let ms = hourMilliseconds + minute * H.minute
    while (value < 60) {
      yield { ...rest, minute: value, milliseconds: ms, hourMilliseconds }
      const next = incrementor(value)
      ms += (next - value) * H.minute
      value = next
    }
    return { ...rest, minute: value % 60, milliseconds: ms, hourMilliseconds }
  }
}

export function buildIterator(start: Date, end: Date, constraints: IConstraints = {}) {
  const endTime = end.getTime()
  
  const condition = ({ milliseconds }: IMinutes) => milliseconds <= endTime

  const {
    year: yearConstraint,
    month: monthConstraint,
    date: dateConstraint,
    hour: hourConstraint,
    minute: minuteConstraint
  } = constraints

  const year = { year: start.getFullYear() }
  const month = { month: start.getMonth(), monthMilliseconds: 0, ...year }
  const date = { date: start.getDate(), day: start.getDay(), dateMilliseconds: 0, ...month }
  const hour = { hour: start.getHours(), hourMilliseconds: 0, ...date }
  const minute = { minute: start.getMinutes(), milliseconds: 0, ...hour }

  const years = withConstraints(yearsIterator, yearConstraint)(year)
  const months = wrapIterable(years, withConstraints(monthsIterator, monthConstraint), month)
  const dates = wrapIterable(months, withConstraints(dateIterator, dateConstraint), date)
  const hours = wrapIterable(dates, withConstraints(hoursIterator, hourConstraint), hour)
  const minutes = wrapIterable(hours, withConstraints(minutesIterator, minuteConstraint), minute)

  return restrictIterable<IMinutes>(minutes, condition)
}

export { IConstraints }