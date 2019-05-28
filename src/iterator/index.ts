import { wrapIterable, restrictIterable, mapIterable, filterIterable } from 'iterator-wrapper'

import { TExpression, TPredicate, IDictionary, isNumber, typeError } from '../utils'

import * as H from '../utils/dateTime'

import { IConstraint, IConstraints } from 'utils/schedule'

import { buildAction } from '../actionBuilder'

import { YEAR, MONTH, DATE, DAY, HOUR, MINUTE } from '../utils/schedule'

interface IYears extends IDictionary<number> {
  [YEAR]: number
}

interface IMonths extends IYears {
  milliseconds: number
  [MONTH]: number
}

interface IDate extends IMonths {
  [DATE]: number
  [DAY]: number
}

interface IHours extends IDate {
  [HOUR]: number
}

interface IMinutes extends IHours {
  [MINUTE]: number
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

type TGenerator<T, R> = (incrementor: TIncrementor, value: number, data: T | number) => IterableIterator<number | R>

function withConstraints<T, R>(generator: TGenerator<T, R>, constraint: IConstraint = {}) {
  const { step, expression } = constraint
  const incrementor = buildIncrementor(step)
  const condition = buildCondition(expression)
  return (value: number, data: T | number) => {
    const gen = generator(incrementor, value, data)
    return condition ? filterIterable(gen, condition) : gen
  }
}

function* yearsIterator(incrementor: TIncrementor, startValue: number) {
  let value = startValue
  while (true) {
    const result = { year: value }
    yield result
    value = incrementor(value)
  }
}

function* monthsIterator(incrementor: TIncrementor, startValue: number, data: IYears | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  const { year } = data
  let value = startValue
  while (value < 12) {
    const result = { month: value, year, milliseconds: new Date(year, value).getTime() }
    yield result
    value = incrementor(value)
  }
  return value % 12
}
function* dateIterator(incrementor: TIncrementor, startValue: number, data: IMonths | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  const { year, month, milliseconds } = data
  const len = H.getMonthLength(year, month) + 1
  let date = startValue
  let day = new Date(year, month, date).getDay()
  let ms = milliseconds
  while (date < len) {
    const result = { day, date, month, year, milliseconds: ms }
    yield result
    const next = incrementor(date)
    const diff = next - date
    day = (day + diff) % 7
    ms += diff * H.day
    date = next
  }
  return date % len + 1
}
function* hoursIterator(incrementor: TIncrementor, startValue: number, data: IDate | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  const { milliseconds } = data
  let value = startValue
  let ms = milliseconds
  while (value < 24) {
    const result = { hour: value, ...data, milliseconds: ms }
    yield result
    const next = incrementor(value)
    ms += (next - value) * H.hour
    value = next
  }
  return value % 24
}

function* minutesIterator(incrementor: TIncrementor, startValue: number, data: IHours | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  const { milliseconds } = data
  let value = startValue
  let ms = milliseconds
  while (value < 60) {
    const result = { minute: value, ...data, milliseconds: ms }
    yield result
    const next = incrementor(value)
    ms += (next - value) * H.minute
    value = next
  }
  return value % 60
}

export function buildIterator(start: Date, end: Date, constraints: IConstraints = {}) {
  const endYear = end.getFullYear()
  const endMonth = end.getMonth()
  const endDate = end.getDate()
  const endHour = end.getHours()
  const endMinute = end.getMinutes()
  const condition = (date: IMinutes) => (
    date.year < endYear || date.year === endYear && (
      date.month < endMonth || date.month === endMonth && (
        date.date < endDate || date.date === endDate && (
          date.hour < endHour || date.hour === endHour && (
            date.minute <= endMinute
          )
        )
      )
    )
  )

  const {
    year: yearConstraint,
    month: monthConstraint,
    date: dateConstraint,
    hour: hourConstraint,
    minute: minuteConstraint
  } = constraints

  const years = withConstraints(yearsIterator, yearConstraint)
  const months = withConstraints(monthsIterator, monthConstraint)
  const date = withConstraints(dateIterator, dateConstraint)
  const hours = withConstraints(hoursIterator, hourConstraint)
  const minutes = withConstraints(minutesIterator, minuteConstraint)

  return restrictIterable<IMinutes>(
    mapIterable(
      wrapIterable<IHours | number, number, IMinutes>(
        wrapIterable<IDate | number, number, IHours>(
          wrapIterable<IMonths | number, number, IDate>(
            wrapIterable<IYears | number, number, IMonths>(
              years(start.getFullYear(), {}),
              months,
              start.getMonth()
            ),
            date,
            start.getDate()
          ),
          hours,
          start.getHours()
        ),
        minutes,
        start.getMinutes()
      ),
      (arg) => {
        if (!isNumber(arg)) {
          return arg
        }
        throw typeError('IDateTime', arg)
      }
    ),
    condition
  )
}