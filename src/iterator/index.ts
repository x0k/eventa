import { wrap, restrict } from 'iterator-wrapper'

import { TExpression, TPredicate, IDictionary, isNumber } from '../utils'

import { getMonthLength } from '../utils/dateTime'

import { IConstraint, IConstraints } from 'utils/schedule'

import { buildAction } from '../actionBuilder'

interface IYears extends IDictionary<number> {
  year: number
}

interface IMonths extends IYears {
  month: number
}

interface IDays extends IMonths {
  day: number
}

interface IHours extends IDays {
  hour: number
}

interface IMinutes extends IHours {
  minute: number
}

export interface IDateTime {
  minute: number
  hour: number
  day: number
  date: number
  month: number
  year: number
}

function buildIncrementor(step: number | TExpression = 1): TIncrementor {
  return isNumber(step)
    ? (value: number) => value + step
    : buildAction(step)
}

function buildCondition<T>(expression?: TExpression): TPredicate<T> {
  return expression ? buildAction(expression) : () => true
}

type TIncrementor = (value: number) => number

type TGenerator<T, R> = (incrementor: TIncrementor, condition: TPredicate<R>, value: number, data: T | number) => IterableIterator<number | R>

function withConstraints<T, R>(generator: TGenerator<T, R>, constraint: IConstraint = {}) {
  const { step, expression } = constraint
  const incrementor = buildIncrementor(step)
  const condition = buildCondition(expression)
  return (value: number, data: T | number) => generator(incrementor, condition, value, data)
}

function* yearsIterator(incrementor: TIncrementor, condition: TPredicate<IYears>, startValue: number) {
  let value = startValue
  while (true) {
    const result = { year: value }
    if (condition(result)) {
      yield result
    }
    value = incrementor(value)
  }
}

function* monthsIterator(incrementor: TIncrementor, condition: TPredicate<IMonths>, startValue: number, data: IYears | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  const { year } = data
  let value = startValue
  while (value < 12) {
    const result = { month: value, year }
    if (condition(result)) {
      yield result
    }
    value = incrementor(value)
  }
  return value % 12
}
function* daysIterator(incrementor: TIncrementor, condition: TPredicate<IDays>, startValue: number, data: IMonths | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  const { year, month } = data
  const len = getMonthLength(year, month)
  let value = startValue
  while (value < len) {
    const result = { day: value, month, year }
    if (condition(result)) {
      yield result
    }
    value = incrementor(value)
  }
  return value % len
}
function* hoursIterator(incrementor: TIncrementor, condition: TPredicate<IHours>, startValue: number, data: IDays | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  let value = startValue
  while (value < 24) {
    const result = { hour: value, ...data }
    if (condition(result)) {
      yield result
    }
    value = incrementor(value)
  }
  return value % 24
}

function* minutesIterator(incrementor: TIncrementor, condition: TPredicate<IMinutes>, startValue: number, data: IHours | number) {
  if (isNumber(data)) {
    throw new Error('Type error')
  }
  let value = startValue
  while (value < 60) {
    const result = { minute: value, ...data }
    if (condition(result)) {
      yield result
    }
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
  const condition = (date: IMinutes | number) => !isNumber(date) && (
    date.year < endYear || date.year === endYear && (
      date.month < endMonth || date.month === endMonth && (
        date.day < endDate || date.day === endDate && (
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
  const days = withConstraints(daysIterator, dateConstraint)
  const hours = withConstraints(hoursIterator, hourConstraint)
  const minutes = withConstraints(minutesIterator, minuteConstraint)

  return restrict<IMinutes | number>(
    wrap<IHours | number, number, IMinutes>(
      wrap<IDays | number, number, IHours>(
        wrap<IMonths | number, number, IDays>(
          wrap<IYears | number, number, IMonths>(
            years(start.getFullYear(), {}),
            months,
            start.getMonth()
          ),
          days,
          start.getDate()
        ),
        hours,
        start.getHours()
      ),
      minutes,
      start.getMinutes()
    ),
    condition
  )
}