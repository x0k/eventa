import { wrapIterable, restrictIterable, mapIterable, filterIterable } from 'iterator-wrapper'

import { TExpression, TPredicate, IDictionary, isNumber, typeError } from '../utils'

import { getMonthLength } from '../utils/dateTime'

import { IConstraint, IConstraints } from 'utils/schedule'

import { buildAction } from '../actionBuilder'

interface IYears extends IDictionary<number> {
  year: number
}

interface IMonths extends IYears {
  month: number
}

interface IDate extends IMonths {
  date: number
  day: number
}

interface IHours extends IDate {
  hour: number
}

interface IMinutes extends IHours {
  minute: number
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
    const result = { month: value, year }
    yield result
    value = incrementor(value)
  }
  return value % 12
}
function* dateIterator(incrementor: TIncrementor, startValue: number, data: IMonths | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  const { year, month } = data
  const len = getMonthLength(year, month) + 1
  let date = startValue
  let day = new Date(year, month, date).getDay()
  while (date < len) {
    const result = { day, date, month, year }
    yield result
    const next = incrementor(date)
    day = (day + next - date) % 7
    date = next
  }
  return date % len + 1
}
function* hoursIterator(incrementor: TIncrementor, startValue: number, data: IDate | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  let value = startValue
  while (value < 24) {
    const result = { hour: value, ...data }
    yield result
    value = incrementor(value)
  }
  return value % 24
}

function* minutesIterator(incrementor: TIncrementor, startValue: number, data: IHours | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  let value = startValue
  while (value < 60) {
    const result = { minute: value, ...data }
    yield result
    value = incrementor(value)
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