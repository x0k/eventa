import { wrap, restrict } from 'iterator-wrapper'

import { TExpression, TPredicate } from 'types'

import { buildAction } from 'actionBuilder'

import {
  IConstraints,
  IYears,
  IMonths,
  IDays,
  IHours,
  IMinutes,
  IConstraint
} from './types'

import { getMonthLength } from './dateHelper'

const isNumber = <T>(data: number | T): data is number => typeof data === 'number'

function buildIncrementor (step: number | TExpression = 1): TIncrementor {
  return isNumber(step)
    ? (value: number) => value + step
    : buildAction(step)
}

function buildCondition<T> (expression?: TExpression): TPredicate<T> {
  return expression ? buildAction(expression) : () => true
}

type TIncrementor = (value: number) => number

type TGenerator<T, R> = (incrementor: TIncrementor, condition: TPredicate<R>, value: number, data: T | number) => IterableIterator<number | R> 

function withConstraints<T, R> (constraint: IConstraint = {}, generator: TGenerator<T, R>) {
  const { step, expression } = constraint
  const incrementor = buildIncrementor(step)
  const condition = buildCondition(expression)
  return (value: number, data: T | number) => generator(incrementor, condition, value, data)
}

function buildYears (constraint: IConstraint = {}) {
  const { step, expression } = constraint
  const incrementor = buildIncrementor(step)
  const condition = buildCondition(expression)
  return function * years (startValue: number) {
    let value = startValue
    while (true) {
      const result = { year: value }
      if (condition(result)) {
        return result
      }
      value = incrementor(value)
    }
  }
}
function * months (incrementor: TIncrementor, condition: TPredicate<IMonths>, startValue: number, data: IYears | number) {
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
function * days (incrementor: TIncrementor, condition: TPredicate<IDays>, startValue: number, data: IMonths | number) {
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
function * hours (incrementor: TIncrementor, condition: TPredicate<IHours>, startValue: number, data: IDays | number) {
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

function * minutes (incrementor: TIncrementor, condition: TPredicate<IMinutes>, startValue: number, data: IHours | number) {
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

function toMinutes(date: Date): IMinutes {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes()
  }
}

export function buildIterator (start: Date, end: Date, constraints: IConstraints) {
  const condition = (date: IMinutes | number) => !isNumber(date) && (
    date.year < end.getFullYear() ||
    date.month < end.getMonth() ||
    date.day < end.getDate() ||
    date.hour < end.getHours() ||
    date.minute <= end.getMinutes()
  )
  const from = toMinutes(start)

  const years = buildYears(constraints.year)
  const constrainedMonths = withConstraints(constraints.month, months)
  const constrainedDays = withConstraints(constraints.date, days)
  const constrainedHours = withConstraints(constraints.hour, hours)
  const constrainedMinutes = withConstraints(constraints.minute, minutes)

  return restrict<IMinutes | number>(
    wrap<IHours | number, number, IMinutes>(
      wrap<IDays | number, number, IHours>(
        wrap<IMonths | number, number, IDays>(
          wrap<IYears, number, IMonths>(
            years(from.year),
            constrainedMonths,
            from.month
          ),
          constrainedDays,
          from.day
        ),
        constrainedHours,
        from.hour
      ),
      constrainedMinutes,
      from.minute
    ),
    condition
  )
}